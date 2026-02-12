/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { EyeOff, Mail, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import AuthHeader from "./AuthHeader";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/store";
import GoogleButton from "./GoogleButton";

/**
 * Login form component for email/password authentication.
 *
 * Allows users to:
 * - Log in with email and password
 * - Continue with Google OAuth (UI-only; handler not implemented here)
 * - Navigate to signup page
 *
 * Handles session expiration via `?expired=true` query param.
 * On successful login, redirects to homepage (`/`) where auth state is hydrated
 * and the navbar automatically updates to reflect logged-in status.
 */
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

    const hydrateUser = useAuthStore((s) => s.hydrateUser);

  /**
   * Handles form submission for email/password login.
   *
   * - Sends credentials to `/auth/login`
   * - On success: redirects to homepage (`/`)
   * - On failure: displays error message
   *
   * Note: The actual session token is stored in an HTTP-only cookie;
   * the frontend never handles the raw token.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.status === 200) {
        await hydrateUser();
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full lg:w-1/2 h-full flex flex-col overflow-y-auto">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-text-muted-light">
              Find your next stay in Sri Lanka.
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

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 border rounded-lg px-4 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-4 cursor-pointer text-gray-400"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-black font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log In <LogIn size={18} />
                </>
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>


              <GoogleButton />
          </form>

          {/* Only show "session expired" — verified flow no longer lands here */}
          {searchParams.get("expired") && (
            <p className="text-sm text-red-500 text-center">
              Your session has expired. Please log in again.
            </p>
          )}

          <p className="text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
