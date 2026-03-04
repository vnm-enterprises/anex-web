import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get listing
    const { data: listing, error } = await supabase
      .from("listings")
      .select(
        `*,
        districts(name, slug),
        cities(name, slug),
        custom_city,
        listing_images(url, storage_path, display_order),
        listing_amenities(amenities(id, name, icon)),
        profiles(full_name, phone)`,
      )
      .eq("id", id)
      .single();

    if (error || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Increment views count
    await supabase
      .from("listings")
      .update({ views_count: (listing.views_count || 0) + 1 })
      .eq("id", id);

    // Track view in analytics
    await supabase.from("analytics").insert({
      event_type: "listing_view",
      listing_id: id,
      metadata: { user_agent: request.headers.get("user-agent") || "unknown" },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("GET listing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check ownership
    const { data: listing } = await supabase
      .from("listings")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update listing
    const { data: updated, error } = await supabase
      .from("listings")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT listing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
