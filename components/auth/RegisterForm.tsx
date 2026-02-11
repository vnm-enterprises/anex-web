/* eslint-disable @typescript-eslint/no-explicit-any */
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
  RotateCcw,
} from "lucide-react";
import api from "@/lib/api";
import AuthHeader from "./AuthHeader";
import GoogleButton from "./GoogleButton";

type UserType = "rent" | "list";

/**
 * Register form component for new user sign-up.
 * Allows users to choose between renting or listing property,
 * collects name, email, phone, and password, and submits to the auth API.
 *
 * After successful registration, displays a success message and provides
 * an option to resend the verification email if needed.
 *
 * Integrates Google OAuth via `GoogleButton`.
 */
export default function RegisterForm() {
  const [userType, setUserType] = useState<UserType>("rent");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Updates a single field in the form state.
   *
   * @param {string} key - The form field name (e.g., "name", "email").
   * @param {string} value - The new value for the field.
   */
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handles form submission:
   * - Validates required fields.
   * - Sends signup request to `/auth/signup`.
   * - Shows success message and clears form on success.
   */
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.password || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      setSuccess(
        "Verification email sent. Please check your inbox before logging in.",
      );

      // Keep email in form for potential resend
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resends the email verification link to the user's email.
   * Uses the email from the current form state.
   */
  const handleResendVerification = async () => {
    if (!form.email) {
      setError("Email is required to resend verification.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/resend-verification", { email: form.email });
      setSuccess("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full md:w-1/2 flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-8 md:px-12 py-12">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-text-muted mb-8">
            Join our community to start your journey.
          </p>


          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={<User size={18} />}
              value={form.name}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="Email Address"
              placeholder="name@example.com"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={(v) => handleChange("email", v)}
            />

            <Input
              label="Phone Number"
              placeholder="074 123 4567"
              icon={<Phone size={18} />}
              value={form.phone}
              onChange={(v) => handleChange("phone", v)}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              rightIcon={<Eye size={18} />}
              type="password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            {success && (
              <div className="space-y-2">
                <p className="text-sm text-green-600">{success}</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="text-sm text-primary hover:underline flex items-center gap-1 disabled:opacity-60"
                >
                  <RotateCcw size={14} />
                  Resend verification email
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? "Creating account..."
                : userType === "rent"
                  ? "Create Account"
                  : "Create Landlord Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleButton />

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/auth/login" className="font-semibold text-primary">
              Log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a toggleable option for user intent (rent vs. list).
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.icon - Icon to display above the label.
 * @param {string} props.label - Descriptive text for the option.
 * @param {boolean} props.active - Whether this option is currently selected.
 * @param {() => void} props.onClick - Callback when the option is clicked.
 */
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
      className={`cursor-pointer flex flex-col items-center py-3 rounded-lg transition ${
        active ? "bg-white shadow ring-1 ring-gray-200" : "hover:bg-gray-50"
      }`}
    >
      <div className="text-primary mb-1">{icon}</div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

/**
 * Reusable input field with left/right icons and label.
 *
 * @param {Object} props - Component props.
 * @param {string} props.label - Input label shown above the field.
 * @param {string} props.placeholder - Placeholder text inside the input.
 * @param {React.ReactNode} props.icon - Icon displayed on the left side.
 * @param {React.ReactNode} [props.rightIcon] - Optional icon on the right (e.g., visibility toggle).
 * @param {string} [props.type="text"] - Input type (e.g., "text", "password").
 * @param {string} props.value - Current value of the input.
 * @param {(value: string) => void} props.onChange - Callback when input value changes.
 */
function Input({
  label,
  placeholder,
  icon,
  rightIcon,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}