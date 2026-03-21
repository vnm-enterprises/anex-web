import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Review Annex.lk terms for listing policies, payments, user conduct, and liability before using the platform.",
  path: "/terms-of-service",
  keywords: ["terms of service", "Annex.lk terms", "rental platform terms"],
});

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using Annex.lk, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.",
    },
    {
      title: "2. Listing Policies",
      content:
        "Users are responsible for the accuracy of their listings. Each listing must represent a real property available for rent. Misleading information, fraudulent listings, or repeated violations will result in account suspension.",
    },
    {
      title: "3. Payments & Refunds",
      content:
        "Ad boosting fees and listing fees are non-refundable once the service has been initiated. Payments are processed securely through our partners. We do not store credit card details on our servers.",
    },
    {
      title: "4. User Conduct",
      content:
        "You agree not to use the platform for any illegal activities or to harass other users. Spamming, scraping data without permission, and attempting to bypass security measures are strictly prohibited.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "Annex.lk is a marketplace platform. We do not own the properties listed and are not responsible for the conditions or legalities of the rental agreements between landlords and tenants.",
    },
  ];

  return (
    <main className="bg-background py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
          Legal Agreement
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-12">
          Terms of <span className="text-primary italic">Service</span>.
        </h1>

        <div className="prose prose-slate max-w-none space-y-12">
          <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50">
            <p className="text-lg font-bold text-muted-foreground leading-relaxed">
              Last Updated: February 22, 2026. Please read these terms carefully
              before using our platform.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Questions regarding these terms should be directed to our{" "}
              <a
                href="/contact-support"
                className="text-primary font-bold hover:underline"
              >
                Support Team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
