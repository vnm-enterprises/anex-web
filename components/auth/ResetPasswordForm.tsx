/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Lock, EyeOff } from "lucide-react";
import AuthHeader from "./AuthHeader";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

/**
 * Reset password form component.
 *
 * Allows users to set a new password using a valid reset token from email.
 * Token is read from URL query param `token`.
 * On success, redirects to login page with success message.
 */
export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate token presence on mount
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  /**
   * Handles password reset submission.
   *
   * - Validates password match
   * - Sends new password + token to `/auth/reset-password`
   * - On success: redirects to login with success message
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="w-full lg:w-1/2 flex flex-col">
        <AuthHeader />
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
          <div className="w-full max-w-[420px] text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
            <p className="text-text-muted-light">Redirecting to login...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full lg:w-1/2 flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Reset Password
            </h1>
            <p className="text-text-muted-light">
              Enter a new password for your account.
            </p>
          </div>

          {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 border rounded-lg px-4 pr-12"
                  placeholder="••••••••"
                  required
                />
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 border rounded-lg px-4 pr-12"
                  placeholder="••••••••"
                  required
                />
                <EyeOff
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full h-12 bg-primary text-black font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}