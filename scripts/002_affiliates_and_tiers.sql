-- Migration: Affiliate Marketing & Tiered Free Ads
-- Date: 2026-03-13

-- 1. Add affiliate tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
ADD COLUMN IF NOT EXISTS ad_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bonus_boosts INTEGER DEFAULT 0;

-- 2. Create affiliates table for code owners
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  total_commission DECIMAL(10, 2) DEFAULT 0.00,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00, -- 10%
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '12 months'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create affiliate_payouts table (for completeness)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Update the handle_new_user trigger to support referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
BEGIN
  -- Extract affiliate code from metadata if present
  ref_code := new.raw_user_meta_data ->> 'referred_by_code';

  INSERT INTO public.profiles (id, full_name, role, referred_by_code, bonus_boosts)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'role', 'user'),
    ref_code,
    CASE WHEN ref_code IS NOT NULL THEN 3 ELSE 0 END -- Credit 3 free boosts if referred
  )
  ON CONFLICT (id) DO NOTHING;

  -- If referred, increment the referrer's total_referrals count
  IF ref_code IS NOT NULL THEN
    UPDATE public.affiliates
    SET total_referrals = total_referrals + 1
    WHERE code = ref_code;
  END IF;

  RETURN new;
END;
$$;
