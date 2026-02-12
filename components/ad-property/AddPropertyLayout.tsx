
//not in use
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProgressSteps from "./ProgressSteps";
import PropertyPreview from "./PropertyPreview";
import BasicsSection from "./sections/BasicsSection";
import LocationSection from "./sections/LocationSection";
import DetailsAmenitiesSection from "./sections/DetailsAmenitiesSection";
import PhotosSection from "./sections/PhotosSection";
import PricingSection from "./sections/PricingSection";
import FooterActions from "./FooterActions";

/**
 * Multi-step property listing form with live preview.
 *
 * - Desktop: Form (left) + Live Preview (right)
 * - Mobile/Tablet: Single step with Next/Back navigation
 * - Includes "Back to Dashboard" and progress tracking
 */
export default function AddPropertyLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "annex",
    bedrooms: 1,
    bathrooms: 1,
    location: "",
    description: "",
    amenities: [] as string[],
    propertyImages: [] as string[],
    surroundingImages: [] as string[],
    price: 0,
    advanceMonths: 0,
    latLng: null as { lat: number; lng: number } | null,
  });

  const STEPS = [
    { id: "basics", label: "Basics" },
    { id: "location", label: "Location" },
    { id: "details", label: "Details" },
    { id: "photos", label: "Photos" },
    { id: "pricing", label: "Pricing" },
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicsSection
            data={formData}
            onChange={updateField}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={true}
            isLastStep={false}
          />
        );
      case 1:
        return (
          <LocationSection
            data={formData}
            onChange={updateField}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={false}
            isLastStep={false}
          />
        );
      case 2:
        return (
          <DetailsAmenitiesSection
            data={formData}
            onChange={updateField}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={false}
            isLastStep={false}
          />
        );
      case 3:
        return (
          <PhotosSection
            data={formData}
            onChange={updateField}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={false}
            isLastStep={false}
          />
        );
      case 4:
        return (
          <PricingSection
            data={formData}
            onChange={updateField}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={false}
            isLastStep={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold hidden sm:block">List Your Property</h1>
        </div>

        <ProgressSteps current={currentStep} total={STEPS.length} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              {renderStep()}
            </div>
          </div>

          {/* Preview (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Eye size={16} className="text-gray-500" />
                  Live Preview
                </h3>
                <PropertyPreview data={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#162e22]/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 p-4">
        <FooterActions
          onPrev={prevStep}
          onNext={nextStep}
          canGoBack={currentStep > 0}
          canGoNext={currentStep < STEPS.length - 1}
        />
      </div>
    </div>
  );
}

// Eye icon used in preview header
import { Eye } from "lucide-react";