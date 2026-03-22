"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import {
  PROPERTY_TYPES,
  FURNISHED_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/constants";
import type { District, City, Amenity } from "@/lib/types";
import { toast } from "sonner";

export function EditListingForm({ listing }: { listing: any }) {
  const router = useRouter();
  const supabase = createClient();

  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(
    listing.listing_images || [],
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const submitLockRef = useRef(false);

  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description,
    property_type: listing.property_type,
    price: listing.price.toString(),
    district_id: listing.district_id,
    city_id: listing.city_id,
    area: listing.area || "",
    furnished: listing.furnished,
    gender_preference: listing.gender_preference,
    contact_name: listing.contact_name || "",
    contact_phone: listing.contact_phone,
    contact_email: listing.contact_email || "",
    selectedAmenities:
      listing.listing_amenities?.map((a: any) => a.amenity_id) || [],
  });

  useEffect(() => {
    async function load() {
      const [{ data: d }, { data: a }] = await Promise.all([
        supabase.from("districts").select("*").order("name"),
        supabase.from("amenities").select("*").order("name"),
      ]);
      if (d) setDistricts(d);
      if (a) setAmenities(a);
    }
    load();
  }, []);

  useEffect(() => {
    if (!form.district_id) {
      setCities([]);
      return;
    }
    async function loadCities() {
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("district_id", form.district_id)
        .order("name");
      if (data) setCities(data);
    }
    loadCities();
  }, [form.district_id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (existingImages.length + imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((prev: any) => prev.filter((img: any) => img.id !== id));
    setDeletedImageIds((prev) => [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);

    try {
      // 1. Update listing
      const { error: listingError } = await supabase
        .from("listings")
        .update({
          title: form.title,
          description: form.description,
          property_type: form.property_type,
          price: parseInt(form.price),
          district_id: form.district_id,
          city_id: form.city_id,
          area: form.area || null,
          furnished: form.furnished,
          gender_preference: form.gender_preference,
          contact_name: form.contact_name || null,
          contact_phone: form.contact_phone,
          contact_email: form.contact_email || null,
          status: "pending", // Re-review on edit
        })
        .eq("id", listing.id);

      if (listingError) throw listingError;

      // 2. Handle deleted images
      if (deletedImageIds.length > 0) {
        await supabase
          .from("listing_images")
          .delete()
          .in("id", deletedImageIds);
      }

      // 3. Upload new images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `listings/${listing.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, file);

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("listing-images").getPublicUrl(filePath);

          await supabase.from("listing_images").insert({
            listing_id: listing.id,
            url: publicUrl,
            storage_path: filePath,
            display_order: existingImages.length + i,
          });
        }
      }

      // 4. Update amenities
      await supabase
        .from("listing_amenities")
        .delete()
        .eq("listing_id", listing.id);
      if (form.selectedAmenities.length > 0) {
        await supabase.from("listing_amenities").insert(
          form.selectedAmenities.map((amenityId: string) => ({
            listing_id: listing.id,
            amenity_id: amenityId,
          })),
        );
      }

      toast.success("Listing updated successfully!");
      router.push(`/dashboard/listings/${listing.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update listing",
      );
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Property Type</Label>
                <Select
                  value={form.property_type}
                  onValueChange={(v) => updateForm("property_type", v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Monthly Rent (LKR)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Furnished Status</Label>
                <Select
                  value={form.furnished}
                  onValueChange={(v) => updateForm("furnished", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FURNISHED_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Gender Preference</Label>
                <Select
                  value={form.gender_preference}
                  onValueChange={(v) => updateForm("gender_preference", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>District</Label>
                <Select
                  value={form.district_id}
                  onValueChange={(v) => {
                    updateForm("district_id", v);
                    updateForm("city_id", "");
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>City</Label>
                <Select
                  value={form.city_id}
                  onValueChange={(v) => updateForm("city_id", v)}
                  required
                  disabled={cities.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Area / Neighborhood (optional)</Label>
              <Input
                id="area"
                value={form.area}
                onChange={(e) => updateForm("area", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {/* Existing Images */}
              {existingImages.map((img: any) => (
                <div
                  key={img.id}
                  className="group relative h-24 w-28 overflow-hidden rounded-lg border border-border"
                >
                  <img src={img.url} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* New Images */}
              {imagePreviews.map((preview, i) => (
                <div
                  key={i}
                  className="group relative h-24 w-28 overflow-hidden rounded-lg border border-border"
                >
                  <img src={preview} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {existingImages.length + imageFiles.length < 5 && (
                <label className="flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <Upload className="mb-1 h-5 w-5" />
                  <span className="text-xs">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <Checkbox
                    checked={form.selectedAmenities.includes(amenity.id)}
                    onCheckedChange={(checked) => {
                      setForm((prev) => ({
                        ...prev,
                        selectedAmenities: checked
                          ? [...prev.selectedAmenities, amenity.id]
                          : prev.selectedAmenities.filter(
                              (id: string) => id !== amenity.id,
                            ),
                      }));
                    }}
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24 border-border">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={form.contact_name}
                onChange={(e) => updateForm("contact_name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                required
                value={form.contact_phone}
                onChange={(e) => updateForm("contact_phone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email (optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contact_email}
                onChange={(e) => updateForm("contact_email", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
