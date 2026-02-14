import Stripe from "stripe";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";

let stripe: Stripe | null = null;

export function getStripe() {
  if (stripe) return stripe;

  if (!env.stripeSecretKey) {
    throw new HttpError(500, "Stripe secret key missing");
  }

  stripe = new Stripe(env.stripeSecretKey, {
    apiVersion: "2025-08-27.basil",
    telemetry: false,
  });

  return stripe;
}

export function toLkrMinorUnits(amountLkr: number) {
  return Math.round(amountLkr * 100);
}
