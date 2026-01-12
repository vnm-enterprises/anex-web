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
  Building,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import api from "@/lib/api";
import AuthHeader from "./AuthHeader";
import GoogleButton from "./GoogleButton";

type UserType = "rent" | "list";

export default function RegisterForm() {
  const [userType, setUserType] = useState<UserType>("rent");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      // ✅ ONLY send what backend expects
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // ✅ Store landlord intent for onboarding (future step)
      if (userType === "list") {
        localStorage.setItem(
          "landlord_onboarding",
          JSON.stringify({
            phone: form.phone,
            propertyName: form.propertyName,
          })
        );
      }

      setSuccess(
        "Verification email sent. Please check your inbox before logging in."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        propertyName: "",
        password: "",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full md:w-1/2 flex flex-col">
      {/* ✅ Correct Header */}
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-8 md:px-12 py-12">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-text-muted mb-8">
            Join our community to start your journey.
          </p>

          {/* User Type */}
          <div className="mb-8">
            <label className="text-sm font-medium mb-2 block">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl border">
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

            {/* {userType === "list" && (
              <>
                <Input
                  label="Phone Number"
                  placeholder="+94 7X XXX XXXX"
                  icon={<Phone size={18} />}
                  value={form.phone}
                  onChange={(v) => handleChange("phone", v)}
                />

                <Input
                  label="Property Name (optional)"
                  placeholder="Sunrise Annex"
                  icon={<Building size={18} />}
                  value={form.propertyName}
                  onChange={(v) =>
                    handleChange("propertyName", v)
                  }
                />
              </>
            )} */}

            <Input
              label="Password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              rightIcon={<Eye size={18} />}
              type="password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600">{success}</p>
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

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <GoogleButton />

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-primary"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

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
      className={` cursor-pointer flex flex-col items-center py-3 rounded-lg transition ${
        active
          ? "bg-white shadow ring-1 ring-gray-200"
          : "hover:bg-gray-50"
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
      <label className="block text-sm font-medium mb-1.5">
        {label}
      </label>
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
