"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuthHook } from "@/hooks/use-auth-hook";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuthHook();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      router.push("/auth/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Set a new password"
      description="Choose a strong password to secure your account."
      fields={[
        {
          key: "newPassword",
          label: "New Password",
          type: "password",
          required: true,
          placeholder: "Enter new password",
          autoComplete: "new-password",
          value: password,
          onChange: setPassword,
        },
        {
          key: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          required: true,
          placeholder: "Confirm new password",
          autoComplete: "new-password",
          value: confirm,
          onChange: setConfirm,
        },
      ]}
      isLoading={loading}
      submitLabel="Update Password"
      loadingLabel="Updating..."
      error={error}
      onSubmit={handleUpdate}
    />
  );
}
