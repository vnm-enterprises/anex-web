-- Migration: Production marketplace search RPC
-- Purpose: Deterministic featured-first ranking with filter-aware pagination.

CREATE OR REPLACE FUNCTION public.search_marketplace_listings(
  p_keyword TEXT DEFAULT NULL,
  p_district_id UUID DEFAULT NULL,
  p_city_id UUID DEFAULT NULL,
  p_property_type TEXT DEFAULT NULL,
  p_furnished TEXT DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_min_price INTEGER DEFAULT NULL,
  p_max_price INTEGER DEFAULT NULL,
  p_sort TEXT DEFAULT 'featured',
  p_page INTEGER DEFAULT 1,
  p_per_page INTEGER DEFAULT 12
)
RETURNS TABLE (
  listing JSONB,
  total_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
WITH filtered AS (
  SELECT
    l.*,
    CASE
      WHEN l.boost_weight > 0
        AND (l.boost_expires_at > now() OR l.boost_expires_at IS NULL)
      THEN 1
      ELSE 0
    END AS featured_bucket,
    CASE
      WHEN l.boost_weight > 0
        AND (l.boost_expires_at > now() OR l.boost_expires_at IS NULL)
      THEN l.boost_weight
      ELSE 0
    END AS featured_weight,
    CASE
      WHEN l.boost_weight > 0
        AND (l.boost_expires_at > now() OR l.boost_expires_at IS NULL)
      THEN l.boost_expires_at
      ELSE NULL
    END AS featured_expiry
  FROM public.listings l
  WHERE l.status = 'approved'
    AND (p_district_id IS NULL OR l.district_id = p_district_id)
    AND (p_city_id IS NULL OR l.city_id = p_city_id)
    AND (p_property_type IS NULL OR p_property_type = '' OR l.property_type = p_property_type)
    AND (p_furnished IS NULL OR p_furnished = '' OR l.furnished = p_furnished)
    AND (p_gender IS NULL OR p_gender = '' OR p_gender = 'any' OR l.gender_preference = p_gender)
    AND (p_min_price IS NULL OR l.price >= p_min_price)
    AND (p_max_price IS NULL OR l.price <= p_max_price)
    AND (
      p_keyword IS NULL
      OR p_keyword = ''
      OR l.search_vector @@ websearch_to_tsquery('simple', p_keyword)
      OR l.title ILIKE '%' || p_keyword || '%'
      OR l.description ILIKE '%' || p_keyword || '%'
      OR COALESCE(l.custom_city, '') ILIKE '%' || p_keyword || '%'
    )
),
totals AS (
  SELECT COUNT(*)::BIGINT AS total_count FROM filtered
),
paged AS (
  SELECT *
  FROM filtered
  ORDER BY
    CASE WHEN p_sort = 'featured' THEN featured_bucket ELSE 0 END DESC,
    CASE WHEN p_sort = 'featured' THEN featured_weight ELSE 0 END DESC,
    CASE WHEN p_sort = 'featured' THEN featured_expiry ELSE NULL END DESC NULLS LAST,
    CASE WHEN p_sort = 'newest' THEN created_at ELSE NULL END DESC,
    CASE WHEN p_sort = 'price_asc' THEN price ELSE NULL END ASC,
    CASE WHEN p_sort = 'price_desc' THEN price ELSE NULL END DESC,
    CASE WHEN p_sort = 'views' THEN views_count ELSE NULL END DESC,
    created_at DESC
  OFFSET (GREATEST(p_page, 1) - 1) * GREATEST(p_per_page, 1)
  LIMIT GREATEST(p_per_page, 1)
)
SELECT
  jsonb_build_object(
    'id', p.id,
    'user_id', p.user_id,
    'title', p.title,
    'description', p.description,
    'slug', p.slug,
    'property_type', p.property_type,
    'price', p.price,
    'district_id', p.district_id,
    'city_id', p.city_id,
    'area', p.area,
    'furnished', p.furnished,
    'gender_preference', p.gender_preference,
    'contact_name', p.contact_name,
    'contact_phone', p.contact_phone,
    'contact_email', p.contact_email,
    'status', p.status,
    'is_boosted', p.is_boosted,
    'boost_expires_at', p.boost_expires_at,
    'boost_weight', p.boost_weight,
    'boost_type', p.boost_type,
    'is_featured', p.is_featured,
    'featured_expires_at', p.featured_expires_at,
    'featured_weight', p.featured_weight,
    'views_count', p.views_count,
    'inquiries_count', p.inquiries_count,
    'payment_status', p.payment_status,
    'expires_at', p.expires_at,
    'custom_city', p.custom_city,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'districts', CASE
      WHEN d.id IS NOT NULL THEN jsonb_build_object('id', d.id, 'name', d.name, 'slug', d.slug)
      ELSE NULL
    END,
    'cities', CASE
      WHEN c.id IS NOT NULL THEN jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'district_id', c.district_id)
      ELSE NULL
    END,
    'listing_images', COALESCE(img.images, '[]'::jsonb)
  ) AS listing,
  t.total_count
FROM paged p
CROSS JOIN totals t
LEFT JOIN public.districts d ON d.id = p.district_id
LEFT JOIN public.cities c ON c.id = p.city_id
LEFT JOIN LATERAL (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', li.id,
      'listing_id', li.listing_id,
      'url', li.url,
      'storage_path', li.storage_path,
      'display_order', li.display_order
    )
    ORDER BY li.display_order
  ) AS images
  FROM public.listing_images li
  WHERE li.listing_id = p.id
) img ON TRUE;
$$;