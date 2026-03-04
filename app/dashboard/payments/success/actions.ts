"use server";

import {
  createClient as createServerClient,
  createAdminClient,
} from "@/lib/supabase/server";
import { getLemonSqueezyOrder } from "@/lib/lemonsqueezy";

export async function updateListingStatusAfterPayment(
  listingId: string,
  orderId?: string | null,
) {
  // UUID Regex check
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(listingId)) {
    return { success: false, error: "Invalid listing ID format" };
  }

  if (!orderId) {
    return { success: false, error: "Missing Order ID" };
  }

  try {
    const supabaseServer = await createServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Use Admin Client to bypass RLS for payment records
    const supabase = createAdminClient();

    // 1. Fetch Lemon Squeezy order
    console.log(
      `[SuccessAction] Fetching order ${orderId} from Lemon Squeezy...`,
    );
    const order = await getLemonSqueezyOrder(orderId);

    if (!order) {
      throw new Error("Order not found in Lemon Squeezy");
    }

    const { attributes } = order;
    const customData = attributes.custom_data;
    const type = customData?.type || "ad_listing";
    const variant_id = (
      attributes?.first_order_item?.variant_id || attributes?.variant_id
    )?.toString();

    // 2. Insert into payments table
    const { error: paymentError } = await supabase.from("payments").upsert(
      {
        lemonsqueezy_order_id: orderId.toString(),
        user_id: user.id,
        listing_id: listingId,
        amount: attributes.total,
        status: "paid",
        payment_type: type,
        variant_id: variant_id,
      },
      { onConflict: "lemonsqueezy_order_id" },
    );

    if (paymentError) {
      console.error("[SuccessAction] Payment table sync error:", paymentError);
    }

    // 3. Update Listings Table
    const updateData: any = {};
    const vIdString = variant_id || "";

    if (vIdString === "1353811") {
      // LEMON_VARIANT_AD_LISTING
      updateData.payment_status = "paid";
      updateData.status = "pending";
    } else if (vIdString === "1353828") {
      // LEMON_VARIANT_QUICK_BOOST
      updateData.is_boosted = true;
      updateData.boost_weight = 1;
    } else if (vIdString === "1353831") {
      // LEMON_VARIANT_PREMIUM_BOOST
      updateData.is_boosted = true;
      updateData.boost_weight = 2;
    } else if (vIdString === "1353841") {
      // LEMON_VARIANT_FEATURED_BOOST
      updateData.is_boosted = true;
      updateData.boost_weight = 3;
      updateData.is_featured = true;
      updateData.featured_weight = 1;
    }

    const { error: updateError } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", listingId);

    if (updateError) {
      console.error("[SuccessAction] Listing update error:", updateError);
      return { success: false, error: "Failed to update listing status" };
    }

    return { success: true };
  } catch (error) {
    console.error("[SuccessAction] Global error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
