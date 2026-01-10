"use client";

import { useState } from "react";
import {
  Search,
  Home,
  User,
  Mail,
  Lock,
  Eye,
  ArrowRight,
  Phone,
  Building,
} from "lucide-react";
import AuthLogo from "./AuthLogo";
import { FaGoogle } from "react-icons/fa";

type UserType = "rent" | "list";

export default function RegisterForm() {
  const [userType, setUserType] = useState<UserType>("rent");

  return (
    <section className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
      {/* Mobile Logo */}
      <div className="md:hidden mb-8 flex justify-center">
        <AuthLogo />
      </div>

      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-text-muted dark:text-gray-400 mb-8">
          Join our community to start your journey.
        </p>

        {/* User Type Selector */}
        <div className="mb-8">
          <label className="text-sm font-medium mb-2 block">I want to...</label>
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
            <UserTypeOption
              icon={<Search size={18} />}
              label="Rent a place"
              active={userType === "rent"}
              onClick={() => setUserType("rent")}
            />
            <UserTypeOption
              icon={<Home size={18} />}
              label="List property"
              active={userType === "list"}
              onClick={() => setUserType("list")}
            />
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Common fields */}
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={<User size={18} />}
          />

          <Input
            label="Email or Phone"
            placeholder="name@example.com"
            icon={<Mail size={18} />}
          />

          {/* Landlord-only fields */}
          {userType === "list" && (
            <>
              <Input
                label="Phone Number"
                placeholder="+94 7X XXX XXXX"
                icon={<Phone size={18} />}
              />

              <Input
                label="Property Name (optional)"
                placeholder="Sunrise Annex"
                icon={<Building size={18} />}
              />
            </>
          )}

          <Input
            label="Password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            rightIcon={<Eye size={18} />}
            type="password"
          />

          <button
            type="button"
            className="w-full bg-primary hover:bg-primary-dark text-background-dark font-bold py-3 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {userType === "rent" ? "Create Account" : "Create Landlord Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-1 gap-4">
          <SocialButton label="Google" />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <a className="font-semibold text-primary hover:underline" href="/login">
            Log in
          </a>
        </p>

        <p className="mt-6 text-center text-xs text-text-muted max-w-xs mx-auto">
          By signing up, you agree to our{" "}
          <a className="underline">Terms of Service</a> and{" "}
          <a className="underline">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}

/* ----------------- helpers ----------------- */

function UserTypeOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-3 rounded-lg cursor-pointer transition
        ${
          active
            ? "bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
    >
      <div className="text-primary mb-1">{icon}</div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function Input({
  label,
  placeholder,
  icon,
  rightIcon,
  type = "text",
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
    >
      <FaGoogle />{label}
    </button>
  );
}
