/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState,  useEffect,  KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Home,
  Building2,
  BedDouble,
  Eye,
  Plus,
  BuildingIcon,
} from "lucide-react";
import api from "@/lib/api";
import PhotoUploadZone from "@/components/dashboard/PhotoUploadZone";

/**
 * Property listing creation page with full backend integration.
 *
 * Features:
 * - Step-by-step flow: Basics → Location → Details → Photos → Pricing
 * - Interactive map using OpenStreetMap (free)
 * - Separate image uploads: 3+ property images, 2+ surrounding images
 * - Dynamic amenities (landlord can add custom ones)
 * - Real-time preview
 * - Full Prisma model compatibility
 */

const predefinedAmenities = [
  { id: "wifi", name: "WiFi" },
  { id: "ac", name: "Air Conditioning" },
  { id: "parking", name: "Parking" },
  { id: "kitchen", name: "Kitchen" },
  { id: "furnished", name: "Furnished" },
  { id: "hot_water", name: "Hot Water" },
  { id: "private_entrance", name: "Private Entrance" },
  { id: "attached_bathroom", name: "Attached Bathroom" },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<{ id: string; name: string }[]>([]);
  const [dynamicAmenities, setDynamicAmenities] = useState<string[]>([]); // Landlord-added
  const [inputValue, setInputValue] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "APARTMENT" as const,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 800,
    location: "",
    description: "",
    amenities: [] as string[],
    propertyImages: [] as string[],
    surroundingImages: [] as string[],
    price: 0,
    keymoney: 0,
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const STEPS = ["Basics", "Location", "Details", "Photos", "Pricing"];
  const isLastStep = currentStep === STEPS.length - 1;

  // Load predefined amenities on mount
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        setAmenities(predefinedAmenities);
      } catch (err) {
        console.error("Failed to load amenities", err);
      }
    };
    loadAmenities();
  }, []);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || currentStep !== 1) return;

    let map: any = null;
    let marker: any = null;

    const initMap = async () => {
      try {
        const L = await import("leaflet");

        // Fix marker icons for Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const mapElement = document.getElementById("property-map");
        if (!mapElement) return;

        const defaultCenter: [number, number] = [7.8731, 80.7718];
        let initialCenter: [number, number] = defaultCenter;
        let initialZoom = 8;

        if (formData.latitude && formData.longitude) {
          initialCenter = [formData.latitude, formData.longitude];
          initialZoom = 15;
        }

        map = L.map(mapElement).setView(initialCenter, initialZoom);

        L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const reverseGeocode = async (lat: number, lng: number) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            if (data.display_name) {
              updateField("location", data.display_name);
            }
          } catch (err) {
            console.warn("Reverse geocoding failed", err);
          }
        };

        if (formData.latitude && formData.longitude) {
          marker = L.marker([formData.latitude, formData.longitude], { draggable: true })
            .addTo(map)
            .on('dragend', function () {
              const pos = marker.getLatLng();
              updateField("latitude", pos.lat);
              updateField("longitude", pos.lng);
              reverseGeocode(pos.lat, pos.lng);
            });
        }

        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          if (marker) map.removeLayer(marker);

          marker = L.marker([lat, lng], { draggable: true })
            .addTo(map)
            .on('dragend', function () {
              const pos = marker.getLatLng();
              updateField("latitude", pos.lat);
              updateField("longitude", pos.lng);
              reverseGeocode(pos.lat, pos.lng);
            });

          updateField("latitude", lat);
          updateField("longitude", lng);
          reverseGeocode(lat, lng);
        });

        setTimeout(() => map.invalidateSize(), 100);
      } catch (err) {
        console.error("Map init error:", err);
      }
    };

    const timer = setTimeout(initMap, 100);
    return () => {
      clearTimeout(timer);
      if (map) map.remove();
    };
  }, [currentStep, formData.latitude, formData.longitude]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle dynamic amenity input
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newAmenity = inputValue.trim();
      if (!dynamicAmenities.includes(newAmenity)) {
        setDynamicAmenities([...dynamicAmenities, newAmenity]);
        setFormData((prev) => ({
          ...prev,
          amenities: [...prev.amenities, newAmenity],
        }));
      }
      setInputValue("");
    }
  };

  const removeDynamicAmenity = (amenity: string) => {
    setDynamicAmenities(dynamicAmenities.filter(a => a !== amenity));
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }));
  };

  const handleSubmit = async () => {
    // Validate image counts
    if (formData.propertyImages.length < 3) {
      setError("At least 3 property images are required");
      return;
    }
    if (formData.surroundingImages.length < 2) {
      setError("At least 2 surrounding images are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        price: formData.price,
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sizeSqft: formData.sizeSqft,
        keymoney: formData.keymoney,
        propertyImages: formData.propertyImages,
        surroundingImages: formData.surroundingImages,
        amenities: formData.amenities.map((id) => ({ id })),
      };

      await api.post("/properties", payload);
      router.push("/dashboard?listing=created");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Basics
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">The Basics</h2>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Property title (e.g. Spacious Annex in Nugegoda)"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Apartment", value: "APARTMENT", icon: Building2 },
                { label: "House", value: "HOUSE", icon: Home },
                { label: "Annex", value: "ANNEX", icon: BedDouble },
                { label: "Boarding", value: "BOARDING", icon: BuildingIcon },
              ].map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateField("propertyType", value)}
                  className={`p-4 rounded-xl border transition-all ${
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
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Bedrooms", field: "bedrooms", value: formData.bedrooms },
                { label: "Bathrooms", field: "bathrooms", value: formData.bathrooms },
                { label: "Size (sqft)", field: "sizeSqft", value: formData.sizeSqft },
              ].map(({ label, field, value }) => (
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
                    <span className="w-10 text-center font-medium">{value}</span>
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

      case 1: // Location
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Location</h2>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Area / City (e.g. Nugegoda, Colombo)"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Select on Map
              </label>
              <div
                id="property-map"
                className="h-64 w-full rounded-xl border border-gray-200 dark:border-gray-700"
                style={{ minHeight: "512px" }}
              />
            </div>
          </div>
        );

      case 2: // Details
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Details & Amenities</h2>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={5}
              placeholder="Describe your property... Mention nearby landmarks, transport, and what makes it special."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />

            {/* Dynamic Amenity Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Add Amenities
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {dynamicAmenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeDynamicAmenity(a)}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type amenity and press Enter..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (inputValue.trim()) {
                      const newAmenity = inputValue.trim();
                      if (!dynamicAmenities.includes(newAmenity)) {
                        setDynamicAmenities([...dynamicAmenities, newAmenity]);
                        setFormData((prev) => ({
                          ...prev,
                          amenities: [...prev.amenities, newAmenity],
                        }));
                        setInputValue("");
                      }
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Suggested Amenities */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Suggested</h4>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        if (!formData.amenities.includes(a.id)) {
                          setFormData((prev) => ({
                            ...prev,
                            amenities: [...prev.amenities, a.id],
                          }));
                        }
                      }}
                      className={`px-3 py-1 rounded-full border transition-colors ${
                        formData.amenities.includes(a.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

     case 3: // Photos
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Photos</h2>

      {/* Property Images */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Property Photos</h3>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            Min. 3 required
          </span>
        </div>

        <PhotoUploadZone
          onUpload={(urls) =>
            setFormData(prev => ({ ...prev, propertyImages: [...prev.propertyImages, ...urls] }))
          }
          maxFiles={10}
          minFiles={3}
          currentCount={formData.propertyImages.length}
          error={error}
          onRemove={(index) =>
            setFormData(prev => ({
              ...prev,
              propertyImages: prev.propertyImages.filter((_, i) => i !== index)
            }))
          }
          previews={formData.propertyImages}
        />
      </div>

      {/* Surrounding Images */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Surrounding Area</h3>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            Min. 2 required
          </span>
        </div>

        <PhotoUploadZone
          onUpload={(urls) =>
            setFormData(prev => ({ ...prev, surroundingImages: [...prev.surroundingImages, ...urls] }))
          }
          maxFiles={5}
          minFiles={2}
          currentCount={formData.surroundingImages.length}
          error={error}
          onRemove={(index) =>
            setFormData(prev => ({
              ...prev,
              surroundingImages: prev.surroundingImages.filter((_, i) => i !== index)
            }))
          }
          previews={formData.surroundingImages}
        />
      </div>
    </div>
  );

      case 4: // Pricing
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Monthly Rent (LKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">LKR</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="45000"
                    value={formData.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="6"
                  value={formData.keymoney}
                  onChange={(e) => updateField("keymoney", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
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

        {/* Progress Bar */}
        <div className="mb-8 mt-6">
          <div className="relative flex justify-between items-center">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div
              className="absolute left-0 top-1/2 h-1 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2 z-10">
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
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              {renderStep()}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={isLastStep ? handleSubmit : () => setCurrentStep(currentStep + 1)}
                  disabled={submitting || uploading}
                  className="px-6 py-2.5 bg-primary text-background-dark rounded-lg font-bold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-1"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : isLastStep ? (
                    "Publish Listing"
                  ) : (
                    "Next"
                  )}
                </button>
              </div>

              {error && !uploading && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
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
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {formData.propertyImages[0] ? (
                      <img src={formData.propertyImages[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No property image
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {formData.title || "Your property title"}
                  </h4>
                  <p className="text-primary font-bold">
                    LKR {formData.price ? formData.price.toLocaleString() : "0"}/mo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.location || "Colombo, Sri Lanka"}
                  </p>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.amenities.slice(0, 3).map((id) => {
                        const amenity = amenities.find(a => a.id === id);
                        return amenity ? (
                          <span key={id} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {amenity.name}
                          </span>
                        ) : (
                          <span key={id} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {id}
                          </span>
                        );
                      })}
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