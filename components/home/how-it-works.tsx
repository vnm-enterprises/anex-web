import { Key, MessageCircle, Search } from 'lucide-react'
import React from 'react'

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-card via-muted/20 to-accent/5 rounded-[3rem] p-12 md:p-20 soft-shadow border border-border/50 animate-fade-in [animation-delay:200ms]">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Find your home with <span className="text-primary">Confidence</span>
            </h2>
            <p className="mt-4 text-muted-foreground font-medium max-w-2xl mx-auto">
              A fast, secure flow built for renters and landlords who want clarity from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                icon: Search,
                title: "1. Search & Filter",
                desc: "Use smart filters to find the perfect rental — by district, type, price, and more. Results update instantly.",
              },
              {
                icon: MessageCircle,
                title: "2. Connect Directly",
                desc: "Message verified landlords directly — no middlemen, no hidden fees. Get answers fast.",
              },
              {
                icon: Key,
                title: "3. Move In Secure",
                desc: "Finalise your agreement and settle into your new home confidently. We're with you every step.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-card rounded-[2rem] flex items-center justify-center mb-8 soft-shadow group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-border/50 ring-4 ring-primary/5">
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