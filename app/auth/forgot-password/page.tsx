"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuthHook } from "@/hooks/use-auth-hook";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuthHook();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      setMessage("Password reset link sent to your email.");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Reset your password"
      description="Enter your email address and we'll send you a reset link."
      fields={[
        {
          key: "email",
          label: "Email",
          type: "email",
          required: true,
          autoComplete: "email",
          placeholder: "you@example.com",
          value: email,
          onChange: setEmail,
        },
      ]}
      isLoading={loading}
      submitLabel="Send Reset Link"
      loadingLabel="Sending link..."
      error={error}
      success={message}
      onSubmit={handleReset}
    />
  );
}
