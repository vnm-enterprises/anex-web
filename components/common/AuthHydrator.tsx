"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

export default function AuthHydrator() {
  const { token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      fetchMe();
    }
  }, [token, fetchMe]);

  return null;
}
