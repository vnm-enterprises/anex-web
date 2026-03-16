"use client";

import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useAuthHook } from "@/hooks/use-auth-hook";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPassword } = useAuthHook();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithPassword({
        email,
        password,
      });
      router.push(redirect);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to manage your listings and dashboard."
      fields={[
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
          key: "password",
          label: "Password",
          type: "password",
          required: true,
          autoComplete: "current-password",
          value: password,
          onChange: setPassword,
        },
      ]}
      isLoading={isLoading}
      submitLabel="Sign In"
      loadingLabel="Signing in..."
      error={error}
      onSubmit={handleLogin}
      preSubmitContent={
        <div className="text-right text-sm">
          <Link
            href="/auth/forgot-password"
            className="text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      }
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md w-full mx-auto flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
