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

    // Boost tier config — duration in days, weight, display type
    const BOOST_CONFIG: Record<string, { days: number; weight: number; boostType: "quick" | "premium" | "featured" }> = {
      "1353828": { days: 7,  weight: 1, boostType: "quick" },
      "1353831": { days: 14, weight: 2, boostType: "premium" },
      "1353841": { days: 30, weight: 3, boostType: "featured" },
    };

    if (eventName === "order_created" || eventName === "order_paid") {
      console.log(
        `[Webhook] Processing ${eventName} for listing ${listing_id} (User: ${user_id})`,
      );

      const { data: existingPayment } = await supabase
        .from("payments")
        .select("status")
        .eq("lemonsqueezy_order_id", orderId.toString())
        .maybeSingle();

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
      const updateData: Record<string, unknown> = {};
      const vIdString = variantId.toString();

      if (vIdString === "1353811") {
        // LEMON_VARIANT_AD_LISTING
        updateData.payment_status = "paid";
        updateData.status = "pending";
      } else if (BOOST_CONFIG[vIdString]) {
        // Boost purchase — apply upgrade-safe logic
        const { days, weight, boostType } = BOOST_CONFIG[vIdString];

        // Fetch current listing state so we never accidentally downgrade an active boost
        const { data: currentListing } = await supabase
          .from("listings")
          .select("boost_weight, boost_expires_at, boost_type, is_featured, featured_expires_at")
          .eq("id", listing_id)
          .maybeSingle();

        const now = new Date();
        const newExpiryCandidate = new Date(now.getTime() + days * 86_400_000);

        const currentBoostExpiry = currentListing?.boost_expires_at
          ? new Date(currentListing.boost_expires_at)
          : new Date(0);
        const currentBoostIsActive =
          (currentListing?.boost_weight ?? 0) > 0 && currentBoostExpiry > now;

        // Preserve only active boost attributes; expired ones must not influence new purchase.
        const activeWeight = currentBoostIsActive
          ? Number(currentListing?.boost_weight ?? 0)
          : 0;
        const activeExpiry = currentBoostIsActive ? currentBoostExpiry : new Date(0);

        const finalWeight = Math.max(activeWeight, weight);
        const finalExpiry =
          newExpiryCandidate > activeExpiry ? newExpiryCandidate : activeExpiry;
        const finalType: "quick" | "premium" | "featured" =
          finalWeight >= 3 ? "featured" : finalWeight === 2 ? "premium" : "quick";

        updateData.is_boosted = true;
        updateData.boost_weight = finalWeight;
        updateData.boost_expires_at = finalExpiry.toISOString();
        updateData.boost_type = finalType;

        // Featured-specific flags are set only when the final active tier is featured.
        if (finalType === "featured") {
          const currentFeaturedExpiry = currentListing?.featured_expires_at
            ? new Date(currentListing.featured_expires_at)
            : new Date(0);
          const activeFeaturedExpiry = currentFeaturedExpiry > now
            ? currentFeaturedExpiry
            : new Date(0);
          const finalFeaturedExpiry =
            newExpiryCandidate > activeFeaturedExpiry
              ? newExpiryCandidate
              : activeFeaturedExpiry;

          updateData.is_featured = true;
          updateData.featured_weight = 1;
          updateData.featured_expires_at = finalFeaturedExpiry.toISOString();
        } else {
          updateData.is_featured = false;
          updateData.featured_weight = 0;
          updateData.featured_expires_at = null;
        }

        console.log(
          `[Webhook] Boost applied: purchased=${boostType} final=${finalType} weight=${finalWeight} expires=${finalExpiry.toISOString()} listing=${listing_id}`,
        );
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
        const shouldCreditAffiliate = existingPayment?.status !== "paid";

        const { data: profile } = await supabase
          .from("profiles")
          .select("referred_by, referred_by_code")
          .eq("id", user_id)
          .single();

        if (shouldCreditAffiliate && (profile?.referred_by || profile?.referred_by_code)) {
          const receivableIncrement = (amount / 100) * 0.1;

          // Resolve affiliate_user id — prefer referred_by FK, fall back to ref_code lookup
          let affiliateUserId: string | null = profile?.referred_by ?? null;

          if (!affiliateUserId && profile?.referred_by_code) {
            const { data: foundByCode } = await supabase
              .from("affiliate_user")
              .select("id")
              .eq("ref_code", profile.referred_by_code)
              .maybeSingle();
            affiliateUserId = foundByCode?.id ?? null;
            if (affiliateUserId) {
              console.log(
                `[Webhook] affiliate_user resolved via ref_code fallback (${profile.referred_by_code})`,
              );
            }
          }

          if (affiliateUserId) {
            const { data: affiliateUserRow } = await supabase
              .from("affiliate_user")
              .select("qualified_purchases, amount_receivable")
              .eq("id", affiliateUserId)
              .maybeSingle();

            if (affiliateUserRow) {
              await supabase
                .from("affiliate_user")
                .update({
                  qualified_purchases: (affiliateUserRow.qualified_purchases ?? 0) + 1,
                  amount_receivable:
                    Number(affiliateUserRow.amount_receivable ?? 0) + receivableIncrement,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", affiliateUserId);

              console.log(
                `[Webhook] affiliate_user updated (qualified_purchases +1, amount_receivable +${receivableIncrement.toFixed(2)})`,
              );
            }
          }
        }

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
