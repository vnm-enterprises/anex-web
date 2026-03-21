import type { Metadata } from "next"
import { CheckCircle, Sparkles, Rocket, TrendingUp, Zap } from "lucide-react"
import { PostAdButton } from "@/components/home/post-ad-button"

export const metadata: Metadata = {
  title: "Simple Pricing | Annex.lk",
  description:
    "Post 3 listings free. After that, pay per listing and optionally boost for stronger visibility.",
}

interface BoostPlan {
  title: string
  icon: typeof Rocket
  description: string
  price: string
  duration: string
  outcome: string
  featured?: boolean
}

const boostPlans: BoostPlan[] = [
  {
    title: "Starter Boost",
    icon: Zap,
    description: "Good for newly posted properties that need a quick push.",
    price: "500",
    duration: "7 days",
    outcome: "Higher search placement",
  },
  {
    title: "Growth Boost",
    icon: TrendingUp,
    description: "Best for competitive locations and high-demand categories.",
    price: "900",
    duration: "14 days",
    outcome: "Priority ranking + stronger exposure",
    featured: true,
  },
  {
    title: "Spotlight Boost",
    icon: Sparkles,
    description: "Maximum visibility for premium listings and urgent occupancy.",
    price: "1,500",
    duration: "30 days",
    outcome: "Top-tier visibility across discovery surfaces",
  },
]

export default function PricingPage() {
  return (
    <div className="animate-fade-in">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden py-28">
        <img
          src="https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=2200"
          alt="Modern apartment exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/80 to-black/15" />
        <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            Marketplace Pricing
          </div>
          <h1 className="mb-8 text-5xl font-black leading-none tracking-tighter text-white md:text-7xl">
            Post 3 Listings <span className="text-primary italic">Free</span>.
            <br />
            Scale with <span className="text-primary italic">Pay-Per-Listing</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-white/85">
            No subscription tiers. No fake enterprise complexity. You only pay when you post beyond your free quota or choose to boost visibility.
          </p>
        </div>
      </section>

      {/* ================= PRICING MODEL ================= */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-10 soft-shadow">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

            <h2 className="mb-3 text-3xl font-black tracking-tighter text-foreground">Free Tier</h2>
            <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">For New Landlords</p>

            <div className="mb-8 flex items-end gap-2">
              <span className="text-6xl font-black tracking-tighter text-primary">3</span>
              <span className="pb-2 text-lg font-bold text-foreground">Free active listings</span>
            </div>

            <div className="space-y-4">
              {[
                "List up to 3 properties free of charge",
                "After 3 listings, pay per additional listing",
                "No special premium features included in free tier",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm font-medium leading-6 text-muted-foreground">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/5 p-10 soft-shadow">
            <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl" />

            <h2 className="mb-3 text-3xl font-black tracking-tighter text-foreground">Pay Per Listing</h2>
            <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">Scale Without Subscriptions</p>

            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter text-foreground">Rs 750</span>
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">per additional active listing</span>
            </div>

            <div className="space-y-4">
              {[
                "Only pay when you exceed 3 free listings",
                "Simple cost model for growing inventory",
                "Optional boosts available for better visibility",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm font-medium leading-6 text-muted-foreground">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOOSTING ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            Optional Visibility Upgrades
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
            Need Better Placement?
            <br />
            <span className="text-primary italic">Boost Any Listing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
            Boosts are optional and time-based. Use them when you want higher visibility in search and discovery.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {boostPlans.map((plan) => (
            <BoostCard key={plan.title} plan={plan} />
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-[10s]" />

          <div className="relative z-10 py-20 px-10 md:px-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
              Start Free Today.
              <br />
              Pay Only When You <span className="italic">Need More Reach.</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Launch your first 3 listings free, then scale with pay-per-listing and optional boosts for stronger visibility.
            </p>
            <PostAdButton
              label="Post Your Free Ad Now"
              className="h-16 px-12 rounded-2xl bg-white text-primary text-xl font-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function BoostCard({ plan }: { plan: BoostPlan }) {
  const Icon = plan.icon

  return (
    <div
      className={`group relative flex flex-col rounded-[2.5rem] border p-8 soft-shadow transition-all duration-300 hover:shadow-2xl ${
        plan.featured ? "border-primary/50 bg-primary/5 ring-4 ring-primary/10" : "border-border/50 bg-card"
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
          Best Value
        </div>
      )}

      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${
          plan.featured
            ? "bg-primary text-white shadow-xl shadow-primary/30"
            : "bg-muted text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white"
        }`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mb-2 text-2xl font-black tracking-tighter">{plan.title}</h3>
      <p className="mb-8 font-medium leading-relaxed text-muted-foreground">{plan.description}</p>

      <div className="mt-auto border-t border-border/50 pt-8">
        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starts at</span>
          <span className="text-4xl font-black tracking-tighter text-foreground">Rs {plan.price}</span>
        </div>
        <p className="text-sm font-bold italic text-primary">{plan.outcome}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Duration: {plan.duration}</p>
      </div>

      <button
        className={`mt-8 w-full rounded-2xl py-4 font-black transition-all ${
          plan.featured
            ? "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40"
            : "bg-muted text-foreground shadow-sm hover:bg-primary hover:text-white"
        }`}
      >
        Boost Now
      </button>
    </div>
  )
}
