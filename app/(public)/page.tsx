import type { Metadata } from "next";
import { DistrictsSection } from "@/components/home/districts-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { HandpickedListings } from "@/components/home/handpicked-listings";
import { HeroSection } from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import { CtaSection } from "@/components/home/cta-section";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Find Rentals Across Sri Lanka",
  description:
    "Discover annexes, boarding places, apartments, and houses with smart filters, verified listings, and featured-first search.",
  path: "/",
  image: `${SITE_URL}/media/images/og-default.jpg`,
  keywords: [
    "Sri Lanka rentals",
    "annex for rent",
    "apartment for rent Sri Lanka",
    "boarding places Sri Lanka",
  ],
});

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RENTR",
    url: SITE_URL,
    logo: `${SITE_URL}/media/images/logo.png`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        <DistrictsSection />
        <FeaturedListings />
        {/* <HandpickedListings /> */}
        <HowItWorks />
        <CtaSection />
      </main>
    </>
  );
}
