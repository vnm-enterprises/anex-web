"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact-form-container"
      className="bg-card rounded-[3rem] p-12 border border-border/50 shadow-2xl"
    >
      <h2 className="text-3xl font-black text-foreground tracking-tighter mb-8">
        Send a <span className="text-primary italic">Message</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4">
              Name
            </label>
            <Input
              name="name"
              required
              placeholder="Your Name"
              className="w-full h-14 rounded-2xl bg-muted/40 border-border/50 px-6 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4">
              Email
            </label>
            <Input
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              className="w-full h-14 rounded-2xl bg-muted/40 border-border/50 px-6 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest ml-4">
            Subject
          </label>
          <select
            name="subject"
            required
            className="flex h-14 w-full items-center justify-between rounded-2xl border border-border/50 bg-muted/40 px-6 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Report a Listing">Report a Listing</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest ml-4">
            Message
          </label>
          <Textarea
            name="message"
            required
            rows={5}
            placeholder="How can we help?"
            className="w-full rounded-2xl bg-muted/40 border-border/50 p-6 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}
