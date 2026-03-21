import type { Metadata } from "next";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Users,
  Phone,
  HelpCircle,
} from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Safety Center",
  description:
    "Learn tenant and landlord safety practices, scam prevention tips, and fraud reporting guidelines on Annex.lk.",
  path: "/safety-center",
  keywords: ["rental safety", "avoid rental scams", "tenant safety Sri Lanka"],
});

export default function SafetyCenterPage() {
  return (
    <main className="bg-background">
      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            Trust & Security
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6">
            Safety <span className="text-primary italic">Center</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Your safety is our priority. Learn how to protect yourself while
            searching for or renting out properties on Annex.lk.
          </p>
        </div>
      </section>

      {/* ================= TIPS SECTIONS ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Tenants */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  For <span className="text-emerald-500">Tenants</span>
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Inspect Before Paying",
                    desc: "Never transfer money (deposits or rent) before physically visiting the property and meeting the landlord.",
                    icon: HelpCircle,
                  },
                  {
                    title: "Verify the Landlord",
                    desc: "Ask for proof of ownership or the landlord's identification before signing any agreements.",
                    icon: Users,
                  },
                  {
                    title: "Secure Payments",
                    desc: "Use traceable payment methods. Avoid sending cash through untrusted third parties.",
                    icon: Lock,
                  },
                  {
                    title: "Avoid 'Too Good' Deals",
                    desc: "If a luxury property is listed at a very low price, it might be a scam. Always trust your intuition.",
                    icon: AlertTriangle,
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-6 p-6 rounded-3xl bg-card border border-border/50 soft-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
                      <tip.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Landlords */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  For <span className="text-primary">Landlords</span>
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Screen your Tenants",
                    desc: "Ask for employment details or previous rental references to ensure reliability.",
                    icon: Users,
                  },
                  {
                    title: "Written Agreements",
                    desc: "Always have a clear, written tenancy agreement signed by both parties to avoid future disputes.",
                    icon: Lock,
                  },
                  {
                    title: "Beware of Overpayments",
                    desc: "Be cautious of users who offer to pay more than the requested amount or use strange payment types.",
                    icon: AlertTriangle,
                  },
                  {
                    title: "Protect your Privacy",
                    desc: "Only share sensitive details like your bank account information after you are confident in the tenant.",
                    icon: Lock,
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-6 p-6 rounded-3xl bg-card border border-border/50 soft-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
                      <tip.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REPORTING ================= */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto mb-8">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-6">
            Seen Something <span className="text-destructive">Suspicious?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 font-medium">
            If you encounter a fraudulent listing or suspicious behavior, please
            report it to us immediately. We take all reports seriously.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:annexlk1@gmail.com"
              className="px-10 h-16 rounded-2xl bg-destructive text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-destructive/20 hover:scale-[1.02] transition-all"
            >
              <Phone size={20} /> Report Fraud
            </a>
            <a
              href="/contact-support"
              className="px-10 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground font-black text-lg hover:bg-muted transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
