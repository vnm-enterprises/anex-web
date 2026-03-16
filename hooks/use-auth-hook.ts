"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/use-auth-store";

/** Payload used for email/password sign in. */
interface SignInPayload {
  email: string;
  password: string;
}

/** Payload used for sign up. */
interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  referredByCode?: string;
  emailRedirectTo: string;
  referredById?: string | null;
}

/** Payload used to send a reset link. */
interface PasswordResetPayload {
  email: string;
  redirectTo: string;
}

/**
 * Encapsulates all Supabase auth calls used by auth pages so UI files
 * only deal with local form state and rendering.
 */
export function useAuthHook() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const supabase = createClient();

  const validateReferralCode = async (code: string) => {
    const normalizedCode = code.trim();
    if (!normalizedCode) return null;

    const { data, error } = await supabase
      .from("affiliate_user")
      .select("id, expires_at")
      .eq("ref_code", normalizedCode)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error("Invalid referral code");
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error("This referral code has expired");
    }

    return data.id;
  };

  const signInWithPassword = async ({ email, password }: SignInPayload) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    setAuth(data.session ?? null, data.user ?? null);
    return data;
  };

  const signUpWithPassword = async ({
    email,
    password,
    fullName,
    phone,
    referredByCode,
    emailRedirectTo,
    referredById,
  }: SignUpPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName,
          phone,
          referred_by_code: referredByCode?.trim() || null,
        },
      },
    });

    if (error) throw error;

    if (data.session && data.user) {
      const profileUpdates: Record<string, unknown> = {
        phone: phone.trim() || null,
      };

      if (referredById) {
        profileUpdates.referred_by = referredById;
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", data.user.id);

      if (profileUpdateError) throw profileUpdateError;
      setAuth(data.session, data.user);
    }

    return data;
  };

  const requestPasswordReset = async ({ email, redirectTo }: PasswordResetPayload) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    if (data.user) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuth(session ?? null, data.user);
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearAuth();
  };

  return {
    validateReferralCode,
    signInWithPassword,
    signUpWithPassword,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
}
