import { AdminListingsClient } from "./admin-listings-client";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Manage Listings - Admin",
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status || "all";

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(
      `
      *,
      districts(name),
      cities(name),
      custom_city,
      profiles!listings_user_id_fkey(full_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: listings } = await query;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </Link>
      <Suspense fallback={null}>
        <AdminListingsClient
          initialListings={listings || []}
          statusFilter={status}
        />
      </Suspense>
    </div>
  );
}
