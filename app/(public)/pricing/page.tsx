import type { Metadata } from "next"
import { CheckCircle, Sparkles, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Simple Pricing | Annex.lk",
  description:
    "List your first 3 properties free. Pay only when you grow. Boost anytime.",
}

export default function PricingPage() {
  return (
    <div className="mt-20">

      {/* ================= HERO ================= */}
      <section className="bg-primary/5 py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Start Free. Pay Only When You Grow.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            No subscriptions. No hidden fees. Just simple pricing.
          </p>
        </div>
      </section>

      {/* ================= FREE MODEL ================= */}
      <section className="mx-auto max-w-5xl px-6 py-24">

        <div className="rounded-3xl border bg-card p-12 shadow-lg text-center">
          <h2 className="text-3xl font-bold">Free Forever Plan</h2>

          <p className="mt-4 text-muted-foreground">
            List up to <span className="font-semibold text-foreground">3 active properties</span> completely free.
          </p>

          <p className="mt-10 text-5xl font-bold text-primary">
            Free
          </p>

          <div className="mt-10 grid gap-6 text-sm text-muted-foreground sm:grid-cols-2 text-left max-w-3xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              3 Active Listings
            </div>
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              30 Days Visibility
            </div>
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              Up to 10 Images
            </div>
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              Standard Search Placement
            </div>
          </div>

          <p className="mt-10 text-muted-foreground">
            Need more than 3 listings?
          </p>

          <p className="mt-3 text-3xl font-bold">
            Rs. 750 <span className="text-sm text-muted-foreground">per additional active listing</span>
          </p>
        </div>

      </section>

      {/* ================= BOOSTING ================= */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <h2 className="text-center text-3xl font-bold mb-14">
          Want More Visibility?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">

          {/* QUICK BOOST */}
          <div className="rounded-2xl border bg-card p-8 text-center hover:shadow-lg transition">
            <Rocket className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Quick Boost
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Higher search ranking for 7 days.
            </p>

            <p className="mt-6 text-3xl font-bold text-primary">
              Rs. 500
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              2× visibility
            </p>
          </div>

          {/* PREMIUM BOOST */}
          <div className="rounded-2xl border-2 border-primary bg-card p-8 text-center shadow-lg scale-105">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Premium Boost
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Homepage + priority search for 14 days.
            </p>

            <p className="mt-6 text-3xl font-bold text-primary">
              Rs. 900
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              3× visibility
            </p>
          </div>

          {/* FEATURED */}
          <div className="rounded-2xl border bg-card p-8 text-center hover:shadow-lg transition">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Featured Spotlight
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Maximum exposure for 30 days.
            </p>

            <p className="mt-6 text-3xl font-bold text-primary">
              Rs. 1,500
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Top placement everywhere
            </p>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-primary/5 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Your first 3 listings are free.
          </h2>

          <p className="mt-4 text-muted-foreground">
            Create an account and start receiving inquiries today.
          </p>

          <button className="mt-8 rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition">
            Post Your First Listing
          </button>
        </div>
      </section>

    </div>
  )
}
