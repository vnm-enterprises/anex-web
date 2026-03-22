import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how RENTR collects, uses, and protects personal data for tenants and landlords in Sri Lanka.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "RENTR privacy", "data protection Sri Lanka"],
});

export default function PrivacyPage() {
  const policies = [
    {
      title: "Data We Collect",
      items: [
        "Account Information: Name, email, and phone number when you register.",
        "Listing Data: Property details, images, and pricing provided by landlords.",
        "Usage Data: Interaction with listings, search queries, and device information.",
        "Communications: Messages sent through our inquiry system.",
      ],
    },
    {
      title: "How We Use Your Information",
      items: [
        "To provide and maintain our rental marketplace services.",
        "To connect tenants with landlords effectively.",
        "To prevent fraud and enhance platform security.",
        "To improve our search algorithms and user experience.",
      ],
    },
    {
      title: "Data Portability & Deletion",
      items: [
        "You have the right to request a copy of your personal data.",
        "You can request the deletion of your account and related listings at any time.",
        "We retain certain data as required by Sri Lankan law for audit purposes.",
      ],
    },
  ];

  return (
    <main className="bg-background py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
          Your Privacy Matters
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-12">
          Privacy <span className="text-primary italic">Policy</span>.
        </h1>

        <div className="prose prose-slate max-w-none space-y-16">
          <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground leading-tight mb-1">
                We protect your data.
              </p>
              <p className="text-muted-foreground font-medium">
                RENTR does not sell your personal information to third-party
                advertisers. Ever.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            {policies.map((policy, i) => (
              <section key={i} className="space-y-6">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {policy.title}
                </h2>
                <ul className="space-y-4">
                  {policy.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-4 text-muted-foreground text-lg font-medium leading-relaxed"
                    >
                      <span className="text-primary font-black">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-border">
            <p className="text-sm text-muted-foreground text-center italic">
              RENTR, Colombo 01, Sri Lanka. Last Updated: February 22, 2026.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
