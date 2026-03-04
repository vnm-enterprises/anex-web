import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";

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
    const { listing_id, plan_slug, type } = body;

    if (!listing_id || listing_id === "" || !type) {
      return NextResponse.json(
        { error: "Missing required fields: listing_id and type are required" },
        { status: 400 },
      );
    }

    // Basic UUID format check (optional but helps avoid Supabase error)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[1-5][0-9a-f]{11}$/i;
    // Note: Simple check for length or presence is often enough if we trust the source
    if (listing_id.length !== 36 && !listing_id.includes("-")) {
      return NextResponse.json(
        { error: "Invalid listing_id format" },
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

    let variantId = "";
    let finalPlanSlug = plan_slug;

    if (type === "ad_listing") {
      variantId = process.env.LEMON_VARIANT_AD_LISTING!;
      finalPlanSlug = "standard";
    } else if (type === "boost") {
      if (plan_slug === "quick") {
        variantId = process.env.LEMON_VARIANT_QUICK_BOOST!;
      } else if (plan_slug === "premium") {
        variantId = process.env.LEMON_VARIANT_PREMIUM_BOOST!;
      } else if (plan_slug === "featured") {
        variantId = process.env.LEMON_VARIANT_FEATURED_BOOST!;
      } else {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
    }

    if (!variantId) {
      return NextResponse.json(
        { error: "Payment variant not configured" },
        { status: 500 },
      );
    }
    console.info("email : ", user.email)
    const checkoutUrl = await createLemonSqueezyCheckout({
      storeId: process.env.LEMON_SQUEEZY_STORE_ID!,
      variantId,
      listingId: listing_id,
      userId: user.id,
      type,
      planSlug: finalPlanSlug,
      userEmail: user.email,
      userName: user.user_metadata?.full_name,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
