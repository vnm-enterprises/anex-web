"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ListingsSection from "@/components/dashboard/ListingsSection";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const hydrateUser = useAuthStore((state) => state.hydrateUser);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      hydrateUser();
      router.push('/');
    }
  }, [isAuthenticated, loading, hydrateUser, router]);

  if (loading || !isAuthenticated) {
    return null; // or <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <ListingsSection />
      </div>
    </DashboardLayout>
  );
}