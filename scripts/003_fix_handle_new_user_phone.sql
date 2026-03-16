-- Migration: Fix handle_new_user trigger to save phone, resolve referred_by UUID,
-- and increment affiliate_user.total_users_brought_in on referral.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref_code        TEXT;
  v_affiliate_id    UUID;
BEGIN
  v_ref_code := new.raw_user_meta_data ->> 'referred_by_code';

  -- Resolve the affiliate_user UUID from the referral code (if provided and not expired)
  IF v_ref_code IS NOT NULL THEN
    SELECT id INTO v_affiliate_id
    FROM public.affiliate_user
    WHERE ref_code = v_ref_code
      AND (expires_at IS NULL OR expires_at > now());
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    phone,
    role,
    referred_by_code,
    referred_by,
    bonus_boosts
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    COALESCE(new.raw_user_meta_data ->> 'role', 'user'),
    v_ref_code,
    v_affiliate_id,
    CASE WHEN v_ref_code IS NOT NULL AND v_affiliate_id IS NOT NULL THEN 3 ELSE 0 END
  )
  ON CONFLICT (id) DO NOTHING;

  -- Increment counters on both affiliate tables when a valid referral is used
  IF v_ref_code IS NOT NULL THEN
    UPDATE public.affiliates
    SET total_referrals = total_referrals + 1
    WHERE code = v_ref_code;
  END IF;

  IF v_affiliate_id IS NOT NULL THEN
    UPDATE public.affiliate_user
    SET total_users_brought_in = total_users_brought_in + 1,
        updated_at = now()
    WHERE id = v_affiliate_id;
  END IF;

  RETURN new;
END;
$$;
