"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function BlogPageClient() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      setSubscribed(true);
      setEmail("");
      toast.success("Welcome to the community!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (subscribed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter subscription success"
          className="w-full max-w-md rounded-3xl border border-border bg-card/95 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300"
        >
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">
            Thank you for subscribing!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            You're now on the list for exclusive updates.
          </p>

          <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-muted/50 border border-border mb-4">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-accent text-accent"
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-foreground italic">
              "Best rental platform in Sri Lanka!"
            </p>
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">
              — Satisfied Landlord
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSubscribed(false)}
            className="w-full rounded-2xl bg-primary text-primary-foreground font-black py-3 px-4 hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-background">
      <section className="relative pt-32 pb-20 border-b border-border overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=2200"
          alt="Modern apartment interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]" />
        <div className="max-w-7xl mx-auto px-6">
          <span className="relative inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            RENTR Insights
          </span>
          <h1 className="relative text-4xl md:text-7xl font-black text-foreground tracking-tighter mb-8 max-w-4xl">
            Everything you need to know about{" "}
            <span className="text-primary italic">Rental Living</span>.
          </h1>
          <p className="relative max-w-2xl text-muted-foreground font-semibold">
            Expert advice for tenants and landlords, from safe renting practices to listing growth strategies.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all"
                    >
                      Read full article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-32 p-16 rounded-[3rem] bg-zinc-900 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-4xl font-black tracking-tighter mb-6 leading-none">
                Get rental tips and new listings{" "}
                <span className="text-primary">straight to your inbox</span>.
              </h3>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 h-16 rounded-2xl bg-white/10 border border-white/20 px-8 font-bold outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Join the Community"
                  )}
                </button>
              </form>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
