import { AdminAffiliatesClient } from "./admin-affiliates-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Management - Admin",
};

export default function AdminAffiliatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Affiliate <span className="text-primary italic">Management</span>.
        </h1>
        <p className="text-muted-foreground font-medium">
          Monitor and grow your affiliate network.
        </p>
      </div>

      <AdminAffiliatesClient />
    </div>
  );
}
