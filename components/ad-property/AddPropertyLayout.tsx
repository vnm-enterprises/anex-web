"use client";

import TopNav from "./TopNav";
import ProgressSteps from "./ProgressSteps";
import BasicsSection from "./sections/BasicsSection";
import LocationSection from "./sections/LocationSection";
import DetailsAmenitiesSection from "./sections/DetailsAmenitiesSection";
import PhotosSection from "./sections/PhotosSection";
import PricingSection from "./sections/PricingSection";
import FooterActions from "./FooterActions";

export default function AddPropertyLayout() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <TopNav />

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            List your property
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Fill in the details to reach thousands of renters in Sri Lanka.
          </p>
        </div>

        <ProgressSteps />

        <form className="space-y-12">
          <BasicsSection />
          <LocationSection />
          <DetailsAmenitiesSection />
          <PhotosSection />
          <PricingSection />
          <FooterActions />
        </form>
      </main>
    </div>
  );
}
