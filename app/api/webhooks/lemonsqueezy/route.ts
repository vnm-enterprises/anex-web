export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { verifyLemonSqueezyWebhook } from "@/lib/lemonsqueezy";
import { sendPaymentSuccessEmail } from "@/lib/email";

// Initialize Supabase with Service Role Key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";

    if (!verifyLemonSqueezyWebhook(rawBody, signature, secret)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    // Extract custom data, checking both meta and attributes (for some event types)
    const customData =
      payload.meta.custom_data || payload.data.attributes.custom_data;

    console.log(`[Webhook] Received event: ${eventName}`, {
      orderId: payload.data.id,
      customData,
    });

    if (!customData || !customData.listing_id || !customData.user_id) {
      console.error("[Webhook] Missing custom data (listing_id or user_id).", {
        meta: payload.meta,
        attributes: payload.data.attributes,
      });
      return NextResponse.json(
        { error: "Missing custom data" },
        { status: 400 },
      );
    }

    const { listing_id, user_id, type } = customData;
    const orderId = payload.data.id;
    const orderAttributes = payload.data.attributes;
    const amount = orderAttributes.total;
    const currency = orderAttributes.currency || "LKR";
    const variantId =
      orderAttributes.first_order_item?.variant_id ||
      orderAttributes.variant_id;

    if (eventName === "order_created" || eventName === "order_paid") {
      console.log(
        `[Webhook] Processing ${eventName} for listing ${listing_id} (User: ${user_id})`,
      );

      // 1. Record/Update payment record (Idempotency via upsert)
      const { error: paymentError } = await supabase.from("payments").upsert(
        {
          lemonsqueezy_order_id: orderId.toString(),
          user_id,
          listing_id,
          amount,
          status: "paid",
          payment_type: type,
          currency,
          variant_id: variantId.toString(),
        },
        { onConflict: "lemonsqueezy_order_id" },
      );

      if (paymentError) {
        console.error(
          "[Webhook] Error inserting/updating payment:",
          paymentError,
        );
      } else {
        console.log("[Webhook] Payment record processed successfully");
      }

      // 2. Update Listing
      const updateData: any = {};
      const vIdString = variantId.toString();

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

      const { error: listingError } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", listing_id);

      if (listingError) {
        console.error("[Webhook] Error updating listing:", listingError);
      } else {
        console.log("[Webhook] Listing updated successfully");
      }

      // 3. Affiliate Commission Logic
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("referred_by_code")
          .eq("id", user_id)
          .single();

        if (profile?.referred_by_code) {
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("id, total_commission, commission_rate")
            .eq("code", profile.referred_by_code)
            .single();

          if (affiliate) {
            const commissionAmount =
              (amount / 100) * (affiliate.commission_rate / 100);

            await supabase
              .from("affiliates")
              .update({
                total_commission:
                  parseFloat(affiliate.total_commission) + commissionAmount,
              })
              .eq("id", affiliate.id);

            console.log(
              `[Webhook] Affiliate commission of Rs. ${commissionAmount} credited to code ${profile.referred_by_code}`,
            );
          }
        }
      } catch (affErr) {
        console.error("[Webhook] Affiliate commission logic failed:", affErr);
      }

      // 4. Send Success Email
      try {
        const { data: userData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user_id)
          .single();

        const { data: listingData } = await supabase
          .from("listings")
          .select("title, contact_email")
          .eq("id", listing_id)
          .single();

        const userEmail = listingData?.contact_email;

        if (userEmail && listingData?.title) {
          await sendPaymentSuccessEmail({
            email: userEmail,
            customerName: userData?.full_name || "User",
            amount: amount / 100, // Lemon Squeezy attributes.total is in cents
            listingTitle: listingData.title,
            orderId: orderId.toString(),
          });
          console.log("[Webhook] Success email sent");
        }
      } catch (emailErr) {
        console.error("[Webhook] Email sending failed:", emailErr);
      }
    } else if (eventName === "order_refunded") {
      console.log(`[Webhook] Processing refund for order ${orderId}`);

      const { error: refundPaymentError } = await supabase
        .from("payments")
        .update({ status: "refunded" })
        .eq("lemonsqueezy_order_id", orderId.toString());

      if (refundPaymentError) {
        console.error(
          "[Webhook] Error updating payment status for refund:",
          refundPaymentError,
        );
      }

      const { error: refundListingError } = await supabase
        .from("listings")
        .update({ payment_status: "refunded" })
        .eq("id", listing_id);

      if (refundListingError) {
        console.error(
          "[Webhook] Error updating listing status for refund:",
          refundListingError,
        );
      }

      console.log("[Webhook] Refund processed successfully");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Webhook] Global error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
