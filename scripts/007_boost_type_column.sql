-- Migration 007: Add boost_type column and populate from existing boost_weight
-- Run this in the Supabase SQL editor before deploying the webhook changes.

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS boost_type VARCHAR(20) CHECK (boost_type IN ('quick', 'premium', 'featured'));

-- Back-fill existing boosted listings based on boost_weight values
UPDATE public.listings
SET boost_type = CASE
  WHEN boost_weight >= 3 THEN 'featured'
  WHEN boost_weight = 2  THEN 'premium'
  WHEN boost_weight = 1  THEN 'quick'
  ELSE NULL
END
WHERE boost_weight > 0 AND boost_type IS NULL;

-- Index for efficient filtering by boost tier
CREATE INDEX IF NOT EXISTS idx_listings_boost_type ON public.listings(boost_type)
  WHERE boost_type IS NOT NULL;
