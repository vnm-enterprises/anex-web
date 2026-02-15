import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { PricingCards } from "./pricing-cards";
import { CheckCircle, Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Flexible pricing options for landlords and agents on Annex.lk.",
};

export default async function PricingPage() {
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true });

  return (
    <div className="mt-20">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-primary/5 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Flexible Pricing for Every Landlord
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            List your property for free, pay once per listing, or unlock
            advanced tools with a subscription. No forced commitments.
          </p>

          <div className="mt-10 flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              No hidden fees
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure payments
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Boost anytime
            </div>
          </div>
        </div>
      </section>

      {/* ================= FREE + ONE TIME ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* FREE TIER */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground">
              Free Starter Plan
            </h2>
            <p className="mt-2 text-muted-foreground">
              Perfect for casual landlords.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>✔ 1 Active Listing</li>
              <li>✔ Up to 5 Images</li>
              <li>✔ 30 Days Visibility</li>
              <li>✖ No Boost Included</li>
            </ul>

            <p className="mt-6 text-3xl font-bold text-primary">Free</p>
          </div>

          {/* PAY PER LISTING */}
          <div className="rounded-2xl border bg-card p-8 shadow-md">
            <h2 className="text-2xl font-bold text-foreground">
              One-Time Listing
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pay only when you need to post.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>✔ 1 Listing (60 Days)</li>
              <li>✔ Up to 15 Images</li>
              <li>✔ Eligible for Boost</li>
              <li>✔ Higher Search Priority</li>
            </ul>

            <p className="mt-6 text-3xl font-bold text-primary">
              Rs. 1,500{" "}
              <span className="text-sm text-muted-foreground">/ listing</span>
            </p>
          </div>
        </div>
      </section>

      {/* ================= SUBSCRIPTIONS ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground">
            For Power Users & Agents
          </h2>
          <p className="mt-4 text-muted-foreground">
            Save more when managing multiple properties.
          </p>
        </div>

        <PricingCards plans={plans || []} />
      </section>

      {/* ================= BOOST ADD-ONS ================= */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
          Boost Your Visibility
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { days: 7, price: "Rs. 500" },
            { days: 14, price: "Rs. 800" },
            { days: 30, price: "Rs. 1,200" },
          ].map((b) => (
            <div
              key={b.days}
              className="rounded-xl border bg-card p-6 text-center hover:shadow-md transition"
            >
              <p className="text-2xl font-bold text-primary">{b.days} Days</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {b.price}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Appear higher in search results & get more inquiries.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
