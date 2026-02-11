/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import AuthHeader from "./AuthHeader";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

/**
 * Forgot password form component.
 *
 * Allows users to request a password reset email by entering their email address.
 * On submission, sends a request to `/auth/forgot-password`.
 * Displays success message regardless of email existence (to prevent enumeration).
 */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission to request a password reset email.
   *
   * - Sends email to `/auth/forgot-password`
   * - On success: shows confirmation message
   * - On error: displays error (e.g., network issue)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("If an account exists for this email, you’ll receive a password reset link shortly.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full lg:w-1/2 flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-text-muted-light">
              Enter your email and we’ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border rounded-lg px-4 pr-10"
                  placeholder="name@example.com"
                  required
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-black font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}