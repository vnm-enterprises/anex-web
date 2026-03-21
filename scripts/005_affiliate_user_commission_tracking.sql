-- Migration: Affiliate user commission tracking fields
-- Adds fields used by payment webhook and admin/dashboard affiliate reporting.

ALTER TABLE public.affiliate_user
ADD COLUMN IF NOT EXISTS qualified_purchases INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_receivable NUMERIC(12, 2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_affiliate_user_qualified_purchases
  ON public.affiliate_user(qualified_purchases);