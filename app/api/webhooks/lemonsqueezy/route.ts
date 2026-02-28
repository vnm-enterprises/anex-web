import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { verifyLemonSqueezyWebhook } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";

    if (!verifyLemonSqueezyWebhook(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;

    if (!customData || !customData.listing_id || !customData.user_id) {
      console.error("Missing custom data in webhook");
      return NextResponse.json(
        { error: "Missing custom data" },
        { status: 400 },
      );
    }

    const { listing_id, user_id, type, plan_slug } = customData;
    const orderId = payload.data.id;
    const amount = payload.data.attributes.total;
    const variantId = payload.data.attributes.variant_id;

    const supabase = await createClient();

    if (eventName === "order_created" || eventName === "order_paid") {
      // Record payment
      const { error: paymentError } = await supabase.from("payments").upsert(
        {
          lemon_squeezy_order_id: orderId,
          user_id,
          listing_id,
          amount,
          status: eventName === "order_paid" ? "paid" : "pending",
          payment_type: type,
          variant_id: variantId.toString(),
        },
        { onConflict: "lemon_squeezy_order_id" },
      );

      if (paymentError) {
        console.error("Error recording payment:", paymentError);
      }
    }

    if (eventName === "order_paid") {
      if (type === "ad_listing") {
        // Update listing status
        const { error: listingError } = await supabase
          .from("listings")
          .update({
            payment_status: "paid",
            lemon_squeezy_order_id: orderId,
          })
          .eq("id", listing_id);

        if (listingError) {
          console.error("Error updating listing payment status:", listingError);
        }
      } else if (type === "boost") {
        // Create boost record and update listing
        const BOOST_PLANS: Record<
          string,
          { price: number; duration: number; type: "boost" | "featured" }
        > = {
          quick: { price: 500, duration: 7, type: "boost" },
          premium: { price: 900, duration: 14, type: "boost" },
          featured: { price: 1500, duration: 30, type: "featured" },
        };

        const plan = BOOST_PLANS[plan_slug];
        if (plan) {
          const now = new Date();
          const expiresAt = new Date(
            now.getTime() + plan.duration * 24 * 60 * 60 * 1000,
          );

          const { data: boost, error: boostError } = await supabase
            .from("boosts")
            .insert({
              listing_id,
              user_id,
              duration_days: plan.duration,
              price: plan.price,
              starts_at: now,
              expires_at: expiresAt,
              lemon_squeezy_order_id: orderId,
            })
            .select()
            .single();

          if (boostError) {
            console.error("Error creating boost record:", boostError);
          } else {
            // Update listing boost fields
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
              console.error("Error updating listing boost info:", updateError);
            }

            // Also update the payment record with the boost_id
            await supabase
              .from("payments")
              .update({ boost_id: boost.id })
              .eq("lemon_squeezy_order_id", orderId);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
