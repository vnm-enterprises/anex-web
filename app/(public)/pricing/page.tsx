import type { Metadata } from "next"
import { CheckCircle, Sparkles, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Simple Pricing | Annex.lk",
  description:
    "List your first 3 properties free. Pay only when you grow. Boost anytime.",
}

export default function PricingPage() {
  return (
    <div className="mt-16 animate-fade-in">
      {/* ================= HERO ================= */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
             Simple & Transparent
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none mb-8">
            Start <span className="text-primary italic">Free</span>. Pay Only When You <span className="text-primary italic">Grow</span>.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Just high-impact rentals with straightforward pricing.
          </p>
        </div>
      </section>

      {/* ================= FREE MODEL ================= */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[3rem] border border-border/50 bg-card p-12 md:p-20 soft-shadow text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
             <Rocket className="h-40 w-40 text-primary" />
          </div>

          <h2 className="text-4xl font-black tracking-tighter mb-4">Free Forever Plan</h2>
          <p className="text-xl text-muted-foreground font-medium mb-12">
            Perfect for individual landlords starting their journey.
          </p>

          <div className="inline-flex items-baseline gap-2 mb-12">
            <span className="text-7xl font-black text-primary tracking-tighter">Free</span>
            <span className="text-muted-foreground font-bold italic">forever</span>
          </div>

          <div className="grid gap-8 text-sm text-muted-foreground sm:grid-cols-2 text-left max-w-3xl mx-auto mb-16">
            {[
              "3 Active Listings",
              "30 Days Visibility",
              "Unlimited Image Support",
              "Standard Search placement",
              "Basic Analytics",
              "Direct Inquiry handling"
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-center group/item">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover/item:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-border/50">
             <p className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Need more scale?</p>
             <h3 className="text-3xl font-black tracking-tighter">
               Rs 750 <span className="text-lg font-medium text-muted-foreground">/ additional active listing</span>
             </h3>
          </div>
        </div>
      </section>

      {/* ================= BOOSTING ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Maximize Reach
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Want More <span className="text-primary italic">Visibility?</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Quick Boost",
              icon: Rocket,
              desc: "Higher search ranking for 7 days.",
              price: "500",
              visibility: "2× visibility",
              color: "primary"
            },
            {
              title: "Premium Boost",
              icon: Sparkles,
              desc: "Homepage spotlight + priority search for 14 days.",
              price: "900",
              visibility: "5× visibility",
              premium: true,
              color: "indigo-600"
            },
            {
              title: "Featured Spotlight",
              icon: CheckCircle,
              desc: "Maximum exposure across the platform for 30 days.",
              price: "1,500",
              visibility: "Top placement everywhere",
              color: "emerald-600"
            }
          ].map((boost, i) => (BoostCard(boost, i)))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-[10s]" />

          <div className="relative z-10 py-20 px-10 md:px-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
              Ready to Rent? <br/> Your first 3 listings are <span className="italic">On Us.</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Join thousands of landlords who trust Annex.lk to find verified tenants faster and safer.
            </p>
            <button className="h-16 px-12 rounded-2xl bg-white text-primary text-xl font-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
               Post Your Free Ad Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BoostCard(boost: any, i: number) {
  return (
    <div key={i} className={`relative flex flex-col p-8 rounded-[2.5rem] border ${boost.premium ? 'border-primary/50 bg-primary/5 ring-4 ring-primary/10' : 'border-border/50 bg-card'} soft-shadow hover:shadow-2xl transition-all duration-300 group`}>
      {boost.premium && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
          Best Value
        </div>
      )}

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${boost.premium ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-muted text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500'}`}>
        <boost.icon className="h-7 w-7" />
      </div>

      <h3 className="text-2xl font-black tracking-tighter mb-2">{boost.title}</h3>
      <p className="text-muted-foreground font-medium mb-8 leading-relaxed">{boost.desc}</p>

      <div className="mt-auto pt-8 border-t border-border/50">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Starts at</span>
          <span className="text-4xl font-black text-foreground tracking-tighter">Rs {boost.price}</span>
        </div>
        <p className="text-sm font-bold text-primary italic">{boost.visibility}</p>
      </div>

      <button className={`mt-8 w-full py-4 rounded-2xl font-black transition-all ${boost.premium ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40' : 'bg-muted text-foreground hover:bg-primary hover:text-white shadow-sm'}`}>
        Boost Now
      </button>
    </div>
  )
}
