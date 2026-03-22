import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { EditListingForm } from "./edit-listing-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      listing_images(*),
      listing_amenities(amenity_id)
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link
        href={`/dashboard/listings/${id}`}
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Listing
      </Link>

      <h1 className="font-display text-4xl font-black text-foreground tracking-tighter">
        Edit Listing
      </h1>
      <EditListingForm listing={listing} />
    </div>
  );
}
