"use client";

import { useState, useEffect } from "react";
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
  slugify,
} from "@/lib/constants";
import type { District, City, Amenity } from "@/lib/types";
import { toast } from "sonner";

export function NewListingForm() {
  const router = useRouter();
  const supabase = createClient();

  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [listingCount, setListingCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "",
    price: "",
    district_id: "",
    city_id: "",
    area: "",
    furnished: "unfurnished",
    gender_preference: "any",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    selectedAmenities: [] as string[],
  });

  useEffect(() => {
    async function load() {
      const [{ data: d }, { data: a }] = await Promise.all([
        supabase.from("districts").select("*").order("name"),
        supabase.from("amenities").select("*").order("name"),
      ]);
      if (d) setDistricts(d);
      if (a) setAmenities(a);

      // Check listing count
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setListingCount(count || 0);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!form.district_id) {
      setCities([]);
      return;
    }
    async function loadCities() {
      // Clear current cities before loading new ones to avoid UI mismatch
      setCities([]);

      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("district_id", form.district_id)
        .order("name");

      if (error) {
        toast.error("Failed to load cities for this district");
        return;
      }

      if (data) setCities(data);
    }
    loadCities();
  }, [form.district_id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
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

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (listingCount >= 3 && !showPayment) {
      setShowPayment(true);
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = slugify(form.title) + "-" + Date.now().toString(36);

      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          slug,
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
          status: "pending",
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `listings/${listing.id}/${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, file);

        if (uploadError) alert(uploadError);
        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("listing-images").getPublicUrl(filePath);

          await supabase.from("listing_images").insert({
            listing_id: listing.id,
            url: publicUrl,
            storage_path: filePath,
            display_order: i,
          });
        }
      }

      // Link amenities
      if (form.selectedAmenities.length > 0) {
        await supabase.from("listing_amenities").insert(
          form.selectedAmenities.map((amenityId) => ({
            listing_id: listing.id,
            amenity_id: amenityId,
          })),
        );
      }

      toast.success("Listing created! It will be visible once approved.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create listing",
      );
    } finally {
      setLoading(false);
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
                placeholder="Spacious 2BR Annex in Colombo 5"
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
                placeholder="Describe your property in detail..."
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
                    <SelectValue placeholder="Select type" />
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
                  placeholder="25000"
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
                    <SelectValue placeholder="Select district" />
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
                    <SelectValue
                      placeholder={
                        cities.length === 0
                          ? "Select district first"
                          : "Select city"
                      }
                    />
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
                placeholder="e.g., Near Bambalapitiya Junction"
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
              {imagePreviews.map((preview, i) => (
                <div
                  key={i}
                  className="group relative h-24 w-28 overflow-hidden rounded-lg border border-border"
                >
                  <img
                    src={preview}
                    alt={`Preview ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 5 && (
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
            <p className="mt-2 text-xs text-muted-foreground">
              Upload up to 5 images. First image will be the cover.
            </p>
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
                              (id) => id !== amenity.id,
                            ),
                      }));
                    }}
                  />
                  <span className="text-foreground">{amenity.name}</span>
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
                placeholder="Your name"
                value={form.contact_name}
                onChange={(e) => updateForm("contact_name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                required
                placeholder="07X XXX XXXX"
                value={form.contact_phone}
                onChange={(e) => updateForm("contact_phone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email (optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="you@email.com"
                value={form.contact_email}
                onChange={(e) => updateForm("contact_email", e.target.value)}
              />
            </div>

            <div className="mt-4 h-px bg-border" />

            {listingCount >= 3 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
                  You have reached the free limit of 3 ads. A one-time payment
                  of Rs. 750 is required for this listing.
                </div>
                <Button
                  type="submit"
                  className="w-full text-white bg-amber-500 hover:bg-amber-600"
                  disabled={loading || paymentLoading}
                >
                  {paymentLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : showPayment ? (
                    "Pay Rs. 750 & Post Ad"
                  ) : (
                    "Review & Pay"
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            )}
            <p className="text-xs text-center text-muted-foreground">
              Your listing will be reviewed before going live.
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
