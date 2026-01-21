/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  MapPin,
  Upload,
  X,
  Eye,
  Home,
  BedDouble,
  Building2,
  Snowflake,
  Car,
  Bath,
  CookingPot,
  Bed,
  ShowerHead,
  Wifi,
  CreditCard,
} from "lucide-react";
import api from "@/lib/api";

/**
 * Single-page property listing form with full backend integration.
 *
 * Features:
 * - Step-by-step flow (Basics → Location → Details → Photos → Pricing)
 * - Live preview on desktop
 * - Image upload to /api/upload
 * - Final submission to /api/properties
 * - Interactive map using OpenStreetMap + Leaflet (free)
 * - Fully responsive design
 */
export default function AddPropertyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "annex",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 800, // Added missing field
    location: "",
    description: "",
    amenities: [] as string[],
    propertyImages: [] as string[],
    surroundingImages: [] as string[], // Currently unused but sent
    price: 0,
    advanceMonths: 0,
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const STEPS = ["Basics", "Location", "Details", "Photos", "Pricing"];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Handle field updates
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle amenity toggle
  const toggleAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  };

  // Handle image upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setUploading(true);
    setError(null);

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          return data.url;
        }),
      );

      setFormData((prev) => ({
        ...prev,
        propertyImages: [...prev.propertyImages, ...urls],
      }));
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index),
    }));
  };

  // Navigate steps
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Submit final form
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Payload matches Prisma Property model exactly
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        price: parseFloat(formData.price.toString()),
        propertyType: formData.propertyType.toUpperCase(),
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sizeSqft: formData.sizeSqft,
        propertyImages: formData.propertyImages,
        surroundingImages: formData.surroundingImages,
        amenities: formData.amenities.map((name) => ({ id: name })),
      };

      const res = await api.post("/properties", payload);
      if (res.status === 201) {
        router.push("/dashboard?listing=success");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to create listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">The Basics</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Property Title
              </label>
              <input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Spacious Annex in Nugegoda with AC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Property Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Annex", value: "annex", icon: Building2 },
                  { label: "Room", value: "room", icon: BedDouble },
                  { label: "Full House", value: "house", icon: Home },
                ].map(({ label, value, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField("propertyType", value)}
                    className={`p-4 rounded-xl border transition-all
                      ${
                        formData.propertyType === value
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                  >
                    <Icon className="mx-auto mb-1" size={20} />
                    <p className="text-sm font-medium">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: "Bedrooms",
                  value: formData.bedrooms,
                  field: "bedrooms",
                },
                {
                  label: "Bathrooms",
                  value: formData.bathrooms,
                  field: "bathrooms",
                },
                {
                  label: "Size (sqft)",
                  value: formData.sizeSqft,
                  field: "sizeSqft",
                },
              ].map(({ label, value, field }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => updateField(field, Math.max(1, value - 1))}
                      className="px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-medium">
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateField(field, value + 1)}
                      className="px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Location</h2>

            <label className="block text-sm font-medium mb-2">
              Full Address (optional)
            </label>

            <input
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g., 123 Main St, Nugegoda"
              className="w-full px-4 py-3 rounded-lg border"
            />

            <p className="text-xs text-gray-500 mt-1">
              Shown only after contacting the owner
            </p>

            {/* Clear button */}
            {(formData.location || formData.latitude || formData.longitude) && (
              <button
                type="button"
                onClick={() => {
                  updateField("location", "");
                  updateField("latitude", null);
                  updateField("longitude", null);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear location
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Details & Amenities</h2>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe your place... Mention nearby landmarks, transport, and what makes it special."
            />

            <div className="flex flex-wrap gap-3">
              {[
                { name: "Air Conditioning", icon: Snowflake },
                { name: "Private Entrance", icon: DoorClosed },
                { name: "Parking", icon: Car },
                { name: "Attached Bathroom", icon: Bath },
                { name: "Kitchen", icon: CookingPot },
                { name: "Furnished", icon: Bed },
                { name: "Hot Water", icon: ShowerHead },
                { name: "WiFi", icon: Wifi },
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleAmenity(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors
                    ${
                      formData.amenities.includes(name)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                  <Icon size={16} />
                  {name}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Photos</h2>
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-center max-w-xs">
                <span className="text-primary font-bold">Click to upload</span>{" "}
                or drag & drop
                <br />
                <span className="text-gray-500 text-xs">
                  PNG, JPG up to 10MB
                </span>
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={uploading}
              />
            </label>

            {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {formData.propertyImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Preview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.propertyImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={url}
                        className="w-full h-full object-cover"
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-primary text-xs px-2 py-1 rounded text-black font-bold">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Monthly Rent (LKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    LKR
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      updateField("price", Number(e.target.value))
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="45000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Key Money / Advance (months)
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.advanceMonths}
                  onChange={(e) =>
                    updateField("advanceMonths", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="6"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // DoorClosed icon component
  function DoorClosed({ size }: { size: number }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
        <path d="M12 12h.01" />
        <path d="M2 20h20" />
      </svg>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background-light to-emerald-50/10 dark:from-background-dark dark:to-emerald-900/5
             text-slate-900 dark:text-white font-display relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
      </div>

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
          <h1 className="text-2xl font-bold hidden sm:block">
            List Your Property
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 mt-6">
          <div className="relative flex justify-between items-center">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div
              className="absolute left-0 top-1/2 h-1 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 z-10"
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${
                      i <= currentStep
                        ? "bg-primary text-background-dark"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                    }`}
                >
                  {i < currentStep ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow">
              {renderStep()}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={isLastStep ? handleSubmit : nextStep}
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 bg-primary text-background-dark rounded-lg font-bold hover:bg-primary/90
                             active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg
                             disabled:opacity-60 flex items-center gap-1"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : isLastStep ? (
                    "Publish Listing"
                  ) : (
                    "Next"
                  )}
                  {!submitting && !isLastStep && (
                    <ArrowLeft className="rotate-180" size={16} />
                  )}
                </button>
              </div>

              {error && !uploading && (
                <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
          </div>

          {/* Preview (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <Eye size={16} className="text-primary" />
                  </div>
                  Live Preview
                </h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {formData.propertyImages[0] ? (
                      <img
                        src={formData.propertyImages[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image uploaded
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {formData.title || "Your property title"}
                  </h4>
                  <p className="text-primary font-bold">
                    LKR {formData.price ? formData.price.toLocaleString() : "0"}
                    /mo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.location || "Colombo, Sri Lanka"}
                  </p>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {formData.description ||
                      "Describe your place... Mention nearby landmarks, transport, and what makes it special."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
