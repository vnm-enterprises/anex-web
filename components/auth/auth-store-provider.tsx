"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/use-auth-store";

/**
 * Initializes auth session state on app load and keeps store synchronized.
 */
export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    let unsubscribe = () => {};

    void initializeAuth().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      unsubscribe();
    };
  }, [initializeAuth]);

  return <>{children}</>;
}
