"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Verified,
  Flag,
  Eye,
  Linkedin,
  Code,
  Clock,
  Megaphone,
  Headphones,
} from "lucide-react";
import { JobApplicationModal } from "@/components/jobs/job-application-modal";
import { useHomeHook } from "@/hooks/use-home-hook";
import { formatAtLeastHundred } from "@/hooks/use-marketplace-stats";

export default function AboutPageClient() {
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const { marketplaceStats } = useHomeHook();

  const stats = [
    {
      value: formatAtLeastHundred(marketplaceStats?.listingsCount),
      label: "Active Listings",
    },
    { value: "50+", label: "Cities Covered" },
    {
      value: formatAtLeastHundred(marketplaceStats?.tenantsCount),
      label: "Happy Tenants",
    },
    { value: "24/7", label: "Support" },
  ];

  return (
    <main className="bg-background text-foreground">
      <JobApplicationModal
        jobTitle={isApplying}
        onClose={() => setIsApplying(null)}
      />
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=2200"
            className="w-full h-full object-cover"
            alt="Modern Sri Lanka urban skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-primary/35 to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6 uppercase tracking-wider">
            Our Story
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building Sri Lanka's <br />
            <span className="text-primary">Rental Future</span>.
          </h1>

          <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto">
            RENTR is the digital home for Sri Lanka's long-term rental market —
            from Colombo's skyline to the southern coast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#mission"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              Read Our Mission <ArrowDown size={16} />
            </a>

            <a
              href="#careers"
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold transition"
            >
              View Open Roles
            </a>
          </div>
        </div>
      </section>

      <section className="-mt-12 relative z-20 max-w-6xl mx-auto px-6">
        <div className="bg-card rounded-2xl border border-border/60 soft-shadow p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="mission" className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1600"
              className="rounded-2xl shadow-2xl h-[500px] w-full object-cover"
              alt="Modern home interior"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Making renting simple, honest, and accessible for everyone.
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
              Finding long-term rentals in Sri Lanka has historically been
              fragmented. RENTR changes that with trust, transparency, and
              digital simplicity.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Flag />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Mission</h3>
                  <p className="text-slate-500">
                    Create a transparent, efficient rental marketplace across
                    Sri Lanka.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Vision</h3>
                  <p className="text-slate-500">
                    Become the digital backbone of Sri Lankan residential real
                    estate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-primary uppercase text-sm font-semibold">
            The Visionary Behind RENTR
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-12">
            Independent & Driven
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12 text-left">
            <div className="w-48 h-48 rounded-3xl shrink-0 border-4 border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent flex items-center justify-center text-center p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/80 font-semibold mb-3">
                  Founder Note
                </p>
                <p className="text-5xl leading-none font-black text-primary">"</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
                  Build local.
                  <br />
                  Serve global.
                </p>
              </div>
            </div>
            <div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                "RENTR was born out of a personal frustration with the
                fragmented rental market in Sri Lanka. As the owner and
                developer, I am committed to building a platform that
                prioritizes transparency, ease of use, and local needs above all
                else."
              </p>
              <h4 className="font-bold text-xl">The Founder</h4>
              <p className="text-primary">RENTR</p>
            </div>
          </div>
        </div>
      </section>

      <section id="careers" className="py-24 relative bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center mb-16">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase">
            We Are Hiring
          </span>
          <h2 className="text-4xl font-bold mt-6 mb-6">
            Build the Future with Us
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Join a team shaping Sri Lanka's digital rental infrastructure.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 space-y-4">
          {[
            { title: "Business Developer", icon: Megaphone },
            { title: "Full Stack Developer", icon: Code },
            { title: "Customer Specialist", icon: Headphones },
            { title: "Product Marketing Manager", icon: Megaphone },
          ].map((job) => (
            <div
              key={job.title}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border hover:border-primary/40 transition"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-slate-500">Remote / Sri Lanka</p>
                </div>

                <button
                  onClick={() => setIsApplying(job.title)}
                  className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-primary/5 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Why RENTR?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
            Because finding and listing rentals should feel transparent, modern,
            and simple. Our platform is built for Sri Lankan users first.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Verified,
                title: "Verified Listings",
                desc: "Reduce risk with verified data and better visibility of property details.",
              },
              {
                icon: Clock,
                title: "Faster Discovery",
                desc: "Smart filters and location-aware search help tenants find relevant homes quickly.",
              },
              {
                icon: Linkedin,
                title: "Local Ecosystem",
                desc: "Designed specifically for Sri Lanka's rental behavior and market structure.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border"
              >
                <item.icon className="text-primary mb-4" size={28} />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Explore Listings <ArrowDown className="rotate-[-90deg]" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
