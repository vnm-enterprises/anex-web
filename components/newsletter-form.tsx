"use client";

import { useState } from "react";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatAtLeastHundred } from "@/hooks/use-marketplace-stats";
import { useHomeHook } from "@/hooks/use-home-hook";

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { marketplaceStats } = useHomeHook();

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error) {
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
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 group">
      <div className="relative">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full px-5 py-4 rounded-2xl bg-card border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm shadow-sm placeholder:text-muted-foreground/50"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-accent text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
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
      <p className="text-[10px] text-center text-muted-foreground px-4">
        Join {formatAtLeastHundred(marketplaceStats?.tenantsCount)} others receiving weekly property alerts.
      </p>
    </form>
  );
}
