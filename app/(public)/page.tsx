import { DistrictsSection } from "@/components/home/districts-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { HandpickedListings } from "@/components/home/handpicked-listings";
import { HeroSection } from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        <DistrictsSection />
        <FeaturedListings />
        {/* <HandpickedListings /> */}
        <HowItWorks />
        <CtaSection />
      </main>
    </>
  );
}
