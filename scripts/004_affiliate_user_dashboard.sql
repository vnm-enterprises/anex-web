-- Migration: Affiliate user dashboard support
-- Safe to run multiple times.

-- 1) Affiliate user table used by dashboard + referral validation
CREATE TABLE IF NOT EXISTS public.affiliate_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  ref_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '12 months'),
  total_users_brought_in INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_user_user_id ON public.affiliate_user(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_user_ref_code ON public.affiliate_user(ref_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_user_expires_at ON public.affiliate_user(expires_at);

-- 2) Profile columns for referral linkage (if missing)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referred_by UUID,
ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
ADD COLUMN IF NOT EXISTS affiliate_code TEXT;

-- 3) Foreign key from profiles.referred_by -> affiliate_user.id (if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_referred_by_affiliate_user_fkey'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_referred_by_affiliate_user_fkey
      FOREIGN KEY (referred_by)
      REFERENCES public.affiliate_user(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code ON public.profiles(referred_by_code);

-- 4) Keep updated_at fresh for affiliate_user
CREATE OR REPLACE FUNCTION public.update_affiliate_user_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_affiliate_user_updated_at ON public.affiliate_user;
CREATE TRIGGER update_affiliate_user_updated_at
  BEFORE UPDATE ON public.affiliate_user
  FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_user_updated_at();

-- 5) RLS policies for affiliate_user
ALTER TABLE public.affiliate_user ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_own_read'
  ) THEN
    CREATE POLICY affiliate_user_own_read
    ON public.affiliate_user
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_own_insert'
  ) THEN
    CREATE POLICY affiliate_user_own_insert
    ON public.affiliate_user
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_own_update'
  ) THEN
    CREATE POLICY affiliate_user_own_update
    ON public.affiliate_user
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
