"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthHook } from "@/hooks/use-auth-hook";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { validateReferralCode, signUpWithPassword } = useAuthHook();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      let affiliateUserId: string | null = null;
      if (referredBy.trim()) {
        affiliateUserId = await validateReferralCode(referredBy);
      }

      await signUpWithPassword({
        email,
        password,
        fullName,
        phone,
        referredByCode: referredBy,
        referredById: affiliateUserId,
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
      });

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Create your account"
        description="Join Sri Lanka's most trusted rental marketplace."
        fields={[
          {
            key: "fullName",
            label: "Full Name",
            placeholder: "John Perera",
            required: true,
            autoComplete: "name",
            value: fullName,
            onChange: setFullName,
          },
          {
            key: "phone",
            label: "Phone Number",
            placeholder: "07X XXX XXXX",
            autoComplete: "tel",
            value: phone,
            onChange: setPhone,
          },
          {
            key: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
            required: true,
            autoComplete: "email",
            value: email,
            onChange: setEmail,
          },
          {
            key: "referralCode",
            label: "Referral Code (Optional)",
            placeholder: "REF123",
            value: referredBy,
            onChange: setReferredBy,
          },
          {
            key: "password",
            label: "Password",
            type: "password",
            required: true,
            autoComplete: "new-password",
            value: password,
            onChange: setPassword,
          },
          {
            key: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            required: true,
            autoComplete: "new-password",
            value: confirmPassword,
            onChange: setConfirmPassword,
          },
        ]}
        isLoading={isLoading}
        submitLabel="Create Account"
        loadingLabel="Creating account..."
        error={error}
        onSubmit={handleSignUp}
      />

      <p className="mt-6 text-sm text-center text-muted-foreground max-w-md w-full mx-auto">
        By creating an account, you agree to our{" "}
        <Link href="/terms-of-service" className="text-primary hover:underline">
          Terms of Service
        </Link>
        .
      </p>

      
    </>
  );
}
