-- Migration: Search sorting and keyword improvements
-- Purpose:
-- 1) Apply featured-first ordering only when sort = 'featured'.
-- 2) Include district/city name matches for keyword searches (e.g., "colombo").

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
WITH params AS (
  SELECT
    NULLIF(BTRIM(p_keyword), '') AS keyword,
    p_district_id AS district_id,
    p_city_id AS city_id,
    NULLIF(BTRIM(p_property_type), '') AS property_type,
    NULLIF(BTRIM(p_furnished), '') AS furnished,
    NULLIF(BTRIM(p_gender), '') AS gender,
    CASE WHEN p_min_price IS NOT NULL AND p_min_price >= 0 THEN p_min_price ELSE NULL END AS min_price,
    CASE WHEN p_max_price IS NOT NULL AND p_max_price >= 0 THEN p_max_price ELSE NULL END AS max_price,
    CASE
      WHEN p_sort IN ('featured', 'newest', 'price_asc', 'price_desc', 'views') THEN p_sort
      ELSE 'featured'
    END AS sort_key,
    GREATEST(p_page, 1) AS safe_page,
    LEAST(GREATEST(p_per_page, 1), 48) AS safe_per_page
),
safe_keyword AS (
  SELECT
    prm.*,
    public.safe_websearch_to_tsquery('simple', prm.keyword) AS keyword_tsquery
  FROM params prm
),
filtered AS (
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
  CROSS JOIN safe_keyword prm
  WHERE l.status = 'approved'
    AND (prm.district_id IS NULL OR l.district_id = prm.district_id)
    AND (prm.city_id IS NULL OR l.city_id = prm.city_id)
    AND (prm.property_type IS NULL OR l.property_type = prm.property_type)
    AND (prm.furnished IS NULL OR l.furnished = prm.furnished)
    AND (prm.gender IS NULL OR prm.gender = 'any' OR l.gender_preference = prm.gender)
    AND (prm.min_price IS NULL OR l.price >= prm.min_price)
    AND (prm.max_price IS NULL OR l.price <= prm.max_price)
    AND (
      prm.keyword IS NULL
      OR (prm.keyword_tsquery IS NOT NULL AND l.search_vector @@ prm.keyword_tsquery)
      OR l.title ILIKE '%' || prm.keyword || '%'
      OR l.description ILIKE '%' || prm.keyword || '%'
      OR COALESCE(l.custom_city, '') ILIKE '%' || prm.keyword || '%'
      OR EXISTS (
        SELECT 1
        FROM public.districts d2
        WHERE d2.id = l.district_id
          AND (
            d2.name ILIKE '%' || prm.keyword || '%'
            OR d2.slug ILIKE '%' || prm.keyword || '%'
          )
      )
      OR EXISTS (
        SELECT 1
        FROM public.cities c2
        WHERE c2.id = l.city_id
          AND (
            c2.name ILIKE '%' || prm.keyword || '%'
            OR c2.slug ILIKE '%' || prm.keyword || '%'
          )
      )
    )
),
totals AS (
  SELECT COUNT(*)::BIGINT AS total_count FROM filtered
),
paged AS (
  SELECT *
  FROM filtered, params prm
  ORDER BY
    CASE WHEN prm.sort_key = 'featured' THEN featured_bucket ELSE 0 END DESC,
    CASE WHEN prm.sort_key = 'featured' THEN featured_weight ELSE 0 END DESC,
    CASE WHEN prm.sort_key = 'featured' THEN featured_expiry ELSE NULL END DESC NULLS LAST,
    CASE WHEN prm.sort_key = 'newest' THEN created_at ELSE NULL END DESC,
    CASE WHEN prm.sort_key = 'price_asc' THEN price ELSE NULL END ASC,
    CASE WHEN prm.sort_key = 'price_desc' THEN price ELSE NULL END DESC,
    CASE WHEN prm.sort_key = 'views' THEN views_count ELSE NULL END DESC,
    created_at DESC
  OFFSET (prm.safe_page - 1) * prm.safe_per_page
  LIMIT prm.safe_per_page
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
 ) img ON TRUE
UNION ALL

-- When page is out of range, still return one row carrying total_count so the client
-- does not need an extra count query round-trip.
SELECT
  NULL::jsonb AS listing,
  t.total_count
FROM totals t
WHERE NOT EXISTS (SELECT 1 FROM paged);
$$;
