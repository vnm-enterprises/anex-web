-- Migration 009: Admin policies for affiliate_user
-- Fixes admin visibility/management gaps in affiliate dashboard.

ALTER TABLE public.affiliate_user ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_admin_read_all'
  ) THEN
    CREATE POLICY affiliate_user_admin_read_all
    ON public.affiliate_user
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
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_admin_insert_all'
  ) THEN
    CREATE POLICY affiliate_user_admin_insert_all
    ON public.affiliate_user
    FOR INSERT
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'affiliate_user'
      AND policyname = 'affiliate_user_admin_update_all'
  ) THEN
    CREATE POLICY affiliate_user_admin_update_all
    ON public.affiliate_user
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
