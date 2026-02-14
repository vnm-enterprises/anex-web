import { DistrictsSection } from "@/components/home/districts-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { HeroSection } from "@/components/home/hero-section";
import { Key, MessageCircle, Search } from "lucide-react";

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

        {/* How it works */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Simple Process</span>
            <h2 className="text-3xl font-bold text-secondary dark:text-white">Rent with Confidence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-round text-primary text-4xl"><Search /></span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Search &amp; Filter</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">Use our advanced filters to find the perfect annex, room, or house that fits your budget and location needs.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                <span className="material-icons-round text-primary text-4xl"><MessageCircle /></span>
                <div className="absolute -top-1 -right-1 bg-emerald text-white rounded-full p-1 border-2 border-white dark:border-slate-800">
                  <span className="material-icons-round text-xs block">check</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Connect with Owners</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">Chat directly with verified landlords. No middleman fees for basic listings, transparency guaranteed.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-round text-primary text-4xl"><Key /></span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Move in Securely</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">Finalize your agreement and move into your new home. We support you until you are settled in.</p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-secondary rounded-2xl overflow-hidden relative py-16 px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Have a property to rent?</h2>
            <p className="text-slate-300 text-lg">Join thousands of landlords finding verified tenants on Annex.lk. Post your ad for free today.</p>
          </div>
          <div className="relative z-10 mt-8 md:mt-0">
            <a className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-transform hover:scale-105" href="#">Post Your Ad Free</a>
          </div>
        </section>
      </main>

   
    </>
  )
}
