"use client";

import AuthHeader from "./AuthHeader";
import { EyeOff, Mail, LogIn } from "lucide-react";
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
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
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Find your next stay in Sri Lanka.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 pr-10 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="name@example.com"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Password</label>
                <button className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type="password"
                  className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 pr-12 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-text-main-light dark:hover:text-white"
                >
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
            >
              Log In <LogIn size={18} />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
              <span className="text-xs uppercase text-slate-400">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10"
            >
              <FaGoogle />
              Sign in with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            Don’t have an account?
            <a href="#" className="ml-1 font-semibold text-primary hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
