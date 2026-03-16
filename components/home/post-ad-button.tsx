"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth-store";

/**
 * CTA button that routes authenticated users to dashboard and guests to login.
 * It waits for auth hydration to avoid mismatched redirects.
 */
export function PostAdButton({ className }: { className?: string }) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return (
      <Button size="lg" disabled className={className}>
        Checking account...
      </Button>
    );
  }

  const href = user
    ? "/dashboard/listings/new"
    : "/auth/login?redirect=/dashboard/listings/new";

  return (
    <Button asChild size="lg" className={className}>
      <Link href={href}>Post Your Ad Free</Link>
    </Button>
  );
}
