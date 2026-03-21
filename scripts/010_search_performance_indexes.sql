-- Migration 010: Search performance indexes for large listing volumes
-- Target: 5k-20k listings with filter-heavy, featured-first marketplace searches.

-- Supports status + featured ordering lookups.
CREATE INDEX IF NOT EXISTS idx_listings_status_boost_rank
ON public.listings (status, boost_weight DESC, boost_expires_at DESC, created_at DESC);

-- Supports district/city + status + sort.
CREATE INDEX IF NOT EXISTS idx_listings_status_district_city_created
ON public.listings (status, district_id, city_id, created_at DESC);

-- Supports common price filtering with status scope.
CREATE INDEX IF NOT EXISTS idx_listings_status_price
ON public.listings (status, price);

-- Supports property/furnished/gender selective filters.
CREATE INDEX IF NOT EXISTS idx_listings_status_type_furnished_gender
ON public.listings (status, property_type, furnished, gender_preference);

-- Supports views sort while preserving status filter.
CREATE INDEX IF NOT EXISTS idx_listings_status_views
ON public.listings (status, views_count DESC, created_at DESC);

-- Improve ILIKE fallback search performance for large text search on title/description.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_listings_title_trgm
ON public.listings USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listings_description_trgm
ON public.listings USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listings_custom_city_trgm
ON public.listings USING GIN (custom_city gin_trgm_ops);
