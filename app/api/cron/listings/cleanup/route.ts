import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendListingExpirationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. Mark listings as expired
  const { data: toExpire, error: expireError } = await supabase
    .from("listings")
    .select("*, profiles(email, full_name)")
    .eq("status", "approved")
    .lt("expires_at", now);

  if (expireError) {
    console.error("Error fetching listings to expire:", expireError);
  } else if (toExpire && toExpire.length > 0) {
    for (const listing of toExpire) {
      await supabase
        .from("listings")
        .update({ status: "expired" })
        .eq("id", listing.id);

      if (listing.profiles?.email) {
        await sendListingExpirationEmail({
          email: listing.profiles.email,
          customerName: listing.profiles.full_name || "Valued User",
          listingTitle: listing.title,
          listingId: listing.id,
        });
      }
    }
  }

  // 2. Permanently delete listings expired for more than 30 days
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Note: We need to delete images from storage too if we want to be thorough.
  // For now, we'll delete the database records. RLS/Triggers should ideally handle storage cleanup,
  // but if not, we should do it here.

  const { data: toDelete, error: deleteFetchError } = await supabase
    .from("listings")
    .select("id")
    .eq("status", "expired")
    .lt("expires_at", thirtyDaysAgo);

  if (deleteFetchError) {
    console.error("Error fetching listings to delete:", deleteFetchError);
  } else if (toDelete && toDelete.length > 0) {
    const ids = toDelete.map((l) => l.id);

    // Cleanup storage first
    for (const id of ids) {
      const { data: images } = await supabase
        .from("listing_images")
        .select("storage_path")
        .eq("listing_id", id);
      if (images && images.length > 0) {
        await supabase.storage
          .from("listing-images")
          .remove(images.map((img) => img.storage_path));
      }
    }

    const { error: finalDeleteError } = await supabase
      .from("listings")
      .delete()
      .in("id", ids);

    if (finalDeleteError) {
      console.error("Error deleting listings:", finalDeleteError);
    }
  }

  return NextResponse.json({
    expired: toExpire?.length || 0,
    deleted: toDelete?.length || 0,
  });
}
