"use client";

import { useState } from "react";
import { EyeOff, Mail, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import AuthHeader from "./AuthHeader";
import { useAuthStore } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = useSearchParams();
  const expired = params.get("expired");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      // handled in store
    }
  };

  return (
    <section className="w-full lg:w-1/2 h-full flex flex-col overflow-y-auto">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Heading */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-text-muted-light">
              Find your next stay in Sri Lanka.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border rounded-lg px-4 pr-10"
                  placeholder="name@example.com"
                  required
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  size={18}
                />
              </div>
            </div>

            {/* Password */}
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
                  className="absolute right-0 top-0 h-full px-4 cursor-pointer"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            {/* Errors */}
            {error && (
              <p className="text-sm text-red-500 font-medium">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-black font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log In <LogIn size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full h-12 border rounded-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <FaGoogle />
              Sign in with Google
            </button>
          </form>

          {/* Session expired */}
          {expired && (
            <p className="text-sm text-red-500 text-center">
              Your session has expired. Please log in again.
            </p>
          )}

          {/* ✅ Sign up link (NEW) */}
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
