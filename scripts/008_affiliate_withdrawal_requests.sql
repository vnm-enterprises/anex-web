-- Migration 008: Affiliate withdrawal requests
-- Run after scripts/004_affiliate_user_dashboard.sql

CREATE TABLE IF NOT EXISTS public.affiliate_withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id UUID NOT NULL REFERENCES public.affiliate_user(id) ON DELETE CASCADE,
  amount_lkr NUMERIC(12,2) NOT NULL CHECK (amount_lkr > 0),
  bank_account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_branch TEXT,
  bank_account_number TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'deposited', 'rejected')),
  admin_note TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aff_withdrawal_affiliate_id
  ON public.affiliate_withdrawal_requests(affiliate_user_id);

CREATE INDEX IF NOT EXISTS idx_aff_withdrawal_status
  ON public.affiliate_withdrawal_requests(status);

CREATE INDEX IF NOT EXISTS idx_aff_withdrawal_requested_at
  ON public.affiliate_withdrawal_requests(requested_at DESC);

CREATE OR REPLACE FUNCTION public.update_affiliate_withdrawal_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_affiliate_withdrawal_updated_at ON public.affiliate_withdrawal_requests;
CREATE TRIGGER update_affiliate_withdrawal_updated_at
  BEFORE UPDATE ON public.affiliate_withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_withdrawal_updated_at();

ALTER TABLE public.affiliate_withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Affiliates can view their own withdrawal requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_withdrawal_requests'
      AND policyname = 'affiliate_withdrawal_own_read'
  ) THEN
    CREATE POLICY affiliate_withdrawal_own_read
    ON public.affiliate_withdrawal_requests
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.affiliate_user au
        WHERE au.id = affiliate_withdrawal_requests.affiliate_user_id
          AND au.user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Affiliates can insert requests only for themselves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_withdrawal_requests'
      AND policyname = 'affiliate_withdrawal_own_insert'
  ) THEN
    CREATE POLICY affiliate_withdrawal_own_insert
    ON public.affiliate_withdrawal_requests
    FOR INSERT
    WITH CHECK (
      status = 'pending' AND
      EXISTS (
        SELECT 1
        FROM public.affiliate_user au
        WHERE au.id = affiliate_withdrawal_requests.affiliate_user_id
          AND au.user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Admin users can read and update all requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_withdrawal_requests'
      AND policyname = 'affiliate_withdrawal_admin_read_all'
  ) THEN
    CREATE POLICY affiliate_withdrawal_admin_read_all
    ON public.affiliate_withdrawal_requests
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'admin'
      )
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_withdrawal_requests'
      AND policyname = 'affiliate_withdrawal_admin_update_all'
  ) THEN
    CREATE POLICY affiliate_withdrawal_admin_update_all
    ON public.affiliate_withdrawal_requests
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'admin'
      )
    );
  END IF;
END
$$;
