
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function AuthHydrator() {
  const hydrateUser = useAuthStore((state) => state.hydrateUser);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      hydrateUser();
    }
  }, [hydrateUser]);

  if (loading) return null;

  return null;
}