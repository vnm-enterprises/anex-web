import crypto from "crypto";

const LEMON_SQUEEZY_API_BASE = "https://api.lemonsqueezy.com/v1";

interface CreateCheckoutParams {
  storeId: string;
  variantId: string;
  listingId: string;
  userId: string;
  type: "ad_listing" | "boost";
  planSlug?: string;
  userEmail?: string;
  userName?: string;
}

export async function createLemonSqueezyCheckout({
  storeId,
  variantId,
  listingId,
  userId,
  type,
  planSlug,
  userEmail,
  userName,
}: CreateCheckoutParams) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error("LEMON_SQUEEZY_API_KEY is not set");
  }

  const response = await fetch(`${LEMON_SQUEEZY_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              listing_id: listingId,
              user_id: userId,
              type: type,
              plan_slug: planSlug || "",
            },
            email: userEmail || "",
            name: userName || "",
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/payments/success`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Lemon Squeezy error:", data);
    throw new Error(data.errors?.[0]?.detail || "Failed to create checkout");
  }

  return data.data.attributes.url;
}

export function verifyLemonSqueezyWebhook(
  body: string,
  signature: string,
  secret: string,
) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (digest.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(digest, signatureBuffer);
}
