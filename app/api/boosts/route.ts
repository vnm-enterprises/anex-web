import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BOOST_PLANS: Record<
  string,
  { price: number; duration: number; type: "boost" | "featured" }
> = {
  quick: { price: 500, duration: 7, type: "boost" },
  premium: { price: 900, duration: 14, type: "boost" },
  featured: { price: 1500, duration: 30, type: "featured" },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, plan_slug } = body;

    if (!listing_id || !plan_slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const plan = BOOST_PLANS[plan_slug];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    // Verify listing belongs to user
    const { data: listing } = await supabase
      .from("listings")
      .select("user_id")
      .eq("id", listing_id)
      .single();

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create boost record
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + plan.duration * 24 * 60 * 60 * 1000,
    );

    const { data: boost, error: boostError } = await supabase
      .from("boosts")
      .insert({
        listing_id,
        user_id: user.id,
        duration_days: plan.duration,
        price: plan.price,
        starts_at: now,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (boostError) {
      return NextResponse.json({ error: boostError.message }, { status: 500 });
    }

    // Update listing based on plan type
    const updateData: any = {
      is_boosted: true,
      boost_expires_at: expiresAt,
    };

    if (plan_slug === "quick") {
      updateData.boost_weight = 1;
    } else if (plan_slug === "premium") {
      updateData.boost_weight = 5;
    } else if (plan_slug === "featured") {
      updateData.is_featured = true;
      updateData.featured_expires_at = expiresAt;
      updateData.featured_weight = 10;
      updateData.boost_weight = 10;
    }

    const { error: updateError } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", listing_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      boost,
      amount: plan.price,
      currency: "LKR",
    });
  } catch (error) {
    console.error("POST boost error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
