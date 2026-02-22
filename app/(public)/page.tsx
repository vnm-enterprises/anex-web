import { DistrictsSection } from "@/components/home/districts-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { HandpickedListings } from "@/components/home/handpicked-listings";
import { HeroSection } from "@/components/home/hero-section";
import { Key, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* Navigation */}


 <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Popular Districts */}
        <DistrictsSection />

        {/* Boosted Listings */}
         <FeaturedListings />

        {/* Handpicked Favorites */}
         <HandpickedListings />

        {/* How it works */}
        <section className="bg-muted/30 rounded-[3rem] p-12 md:p-20 soft-shadow border border-border/50 animate-fade-in [animation-delay:200ms]">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Rent with <span className="text-primary">Confidence</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { icon: Search, title: "1. Search & Filter", desc: "Use our advanced filters to find the perfect annex, room, or house that fits your budget and location needs." },
              { icon: MessageCircle, title: "2. Connect with Owners", desc: "Chat directly with verified landlords. No middleman fees for basic listings, transparency guaranteed." },
              { icon: Key, title: "3. Move in Securely", desc: "Finalize your agreement and move into your new home. We support you until you are settled in." }
            ].map((item, i) => (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-card rounded-[2rem] flex items-center justify-center mb-8 soft-shadow group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-border/50">
                  <item.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-[10s]" />

          <div className="relative z-10 py-16 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                Have a property to rent?
              </h2>
              <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed">
                Join thousands of landlords finding verified tenants on Annex.lk. Post your ad for free today.
              </p>
            </div>
            <div className="shrink-0">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg font-black h-16 px-12 rounded-2xl shadow-2xl shadow-black/20 transition-all hover:scale-105">
                <a href="/dashboard/listings/new">Post Your Ad Free</a>
              </Button>
            </div>
          </div>
        </section>
      </main>


    </>
  )
}
