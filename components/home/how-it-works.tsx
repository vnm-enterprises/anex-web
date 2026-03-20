import { Key, MessageCircle, Search } from 'lucide-react'
import React from 'react'

const HowItWorks = () => {
  return (
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
              {
                icon: Search,
                title: "1. Search & Filter",
                desc: "Use our advanced filters to find the perfect annex, room, or house that fits your budget and location needs.",
              },
              {
                icon: MessageCircle,
                title: "2. Connect with Owners",
                desc: "Chat directly with verified landlords. No middleman fees for basic listings, transparency guaranteed.",
              },
              {
                icon: Key,
                title: "3. Move in Securely",
                desc: "Finalize your agreement and move into your new home. We support you until you are settled in.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-card rounded-[2rem] flex items-center justify-center mb-8 soft-shadow group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-border/50">
                  <item.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
  )
}

export default HowItWorks