"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";

/**
 * Email verification page that processes the token from URL and verifies the user's email.
 *
 * - Extracts token from URL query parameters
 * - Makes API call to verify email
 * - Shows success/error states
 * - Provides redirect to login after success
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const hydrateUser = useAuthStore((s) => s.hydrateUser);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setError("Invalid verification link");
        return;
      }

      setStatus("loading");
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`
        );

        if (response.status == 200) {
          setStatus("success");
          await hydrateUser();
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          const data = await response.data;
          setStatus("error");
          setError(data.error || "Verification failed. Please try again.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setError("Network error. Please try again later.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          {status === "loading" && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {status === "success" && (
            <div className="text-green-500">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
          )}

          {(status === "error" || status === "idle") && (
            <div className="text-red-500">
              <XCircle className="h-16 w-16 mx-auto" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {status === "loading" && "Verifying Email..."}
          {status === "success" && "Email Verified!"}
          {(status === "error" || status === "idle") && "Verification Failed"}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {status === "loading" && "Please wait while we verify your email address..."}
          {status === "success" && "Your email has been successfully verified. Redirecting to login..."}
          {status === "error" && error}
          {status === "idle" && "We couldn't verify your email. Please check the link."}
        </p>

        {(status === "error" || status === "idle") && (
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw size={16} />
              Try Again
            </button>

            <Link
              href="/auth/login"
              className="block text-center text-sm text-primary hover:underline"
            >
              Back to Login
            </Link>
          </div>
        )}

        {status === "success" && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            If you&apos;re not redirected automatically,{" "}
            <Link href="/auth/login?verified=true" className="text-primary hover:underline">
              click here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}