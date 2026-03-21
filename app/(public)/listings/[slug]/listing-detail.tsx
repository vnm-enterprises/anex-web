"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Eye,
  Calendar,
  Sparkles,
  Zap,
  Star,
  Home,
  BedDouble,
  Warehouse,
  Building2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  MessageCircle,
  User,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import { getActiveBoostTier } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

const propertyIcons: Record<string, React.ElementType> = {
  annex: Home,
  boarding: BedDouble,
  house: Warehouse,
  apartment: Building2,
};

export function ListingDetail({ listing }: { listing: Listing }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    sender_name: "",
    sender_phone: "",
    sender_email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);


  const images = listing.listing_images || [];
  const amenities = listing.listing_amenities || [];
  const PropertyIcon = propertyIcons[listing.property_type] || Home;
  const activeTier = getActiveBoostTier(listing);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, [images.length]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.from("inquiries").insert({
      listing_id: listing.id,
      ...inquiryForm,
    });

    if (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } else {
      toast.success("Inquiry sent successfully!");
      setSent(true);
      //TODO implement sms notification feature
    }
    setSending(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 mt-16 animate-fade-in">
      <Link
        href="/search"
        className="mb-10 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </div>
        Back to search
      </Link>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-muted soft-shadow">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={images[currentImage]?.url}
                      alt={`${listing.title} - Image ${currentImage + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-2000 hover:scale-110"
                    />
                  </div>
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImage(
                            currentImage > 0
                              ? currentImage - 1
                              : images.length - 1,
                          )
                        }
                        className="absolute left-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-xl backdrop-blur-md hover:bg-white transition-all active:scale-95 z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImage(
                            currentImage < images.length - 1
                              ? currentImage + 1
                              : 0,
                          )
                        }
                        className="absolute right-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-xl backdrop-blur-md hover:bg-white transition-all active:scale-95 z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center">
                  <PropertyIcon className="h-20 w-20 text-muted-foreground/30" />
                </div>
              )}

              <div className="absolute left-6 top-6 flex flex-col gap-2 z-10">
                {activeTier === "featured" && (
                  <Badge className="bg-amber-500 text-white border-none font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {activeTier === "premium" && (
                  <Badge className="bg-violet-600 text-white border-none font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Premium
                  </Badge>
                )}
                {activeTier === "quick" && (
                  <Badge className="bg-cyan-500 text-white border-none font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg backdrop-blur-sm">
                    <Zap className="h-3 w-3 mr-1 fill-current" />
                    Top
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImage(i)}
                    className={`relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                      i === currentImage
                        ? "border-primary scale-105 shadow-lg"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-card rounded-[3rem] p-8 md:p-12 soft-shadow border border-border/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none font-bold px-4 py-1.5 rounded-full capitalize"
                  >
                    {listing.property_type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-muted text-foreground border-none font-bold px-4 py-1.5 rounded-full capitalize"
                  >
                    {listing.furnished.replace("-", " ")}
                  </Badge>
                  {listing.gender_preference !== "any" && (
                    <Badge
                      variant="secondary"
                      className="bg-muted text-foreground border-none font-bold px-4 py-1.5 rounded-full capitalize"
                    >
                      {listing.gender_preference} preferred
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground font-bold">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg">
                    {listing.cities?.name ?? listing.custom_city},{" "}
                    {listing.districts?.name}
                  </span>
                </div>
                {listing.area && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                    Area / Neighborhood: {listing.area}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="h-14 w-14 rounded-2xl shrink-0 self-end md:self-auto border-border bg-card soft-shadow hover:bg-primary hover:text-white transition-all"
              >
                <Share2 className="h-6 w-6" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-muted/40 rounded-[2rem] border border-border/50 mb-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                  Views
                </span>
                <div className="flex items-center gap-2 text-foreground font-black text-lg">
                  <Eye className="h-4 w-4 text-primary" />
                  {listing.views_count.toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                  Posted
                </span>
                <div className="flex items-center gap-2 text-foreground font-black text-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(listing.created_at)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                  Security
                </span>
                <div className="flex items-center gap-2 text-foreground font-black text-lg">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Verified
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                  Inquiries
                </span>
                <div className="flex items-center gap-2 text-foreground font-black text-lg">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Active
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                About this <span className="text-primary italic">Property</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground font-medium bg-muted/20 p-8 rounded-[2rem] border border-dashed border-border/50">
                {listing.description}
              </p>
            </div>

            {amenities.length > 0 && (
              <div className="mt-12 pt-10 border-t border-border/50">
                <h2 className="mb-6 text-2xl font-black text-foreground tracking-tight">
                  Amenities &{" "}
                  <span className="text-primary italic">Features</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((la: any) => (
                    <div
                      key={la.amenities.id}
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-foreground/80">
                        {la.amenities.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="sticky top-24 rounded-[3rem] border border-border/50 soft-shadow overflow-hidden bg-white dark:bg-slate-950">
            <div className="p-8 pb-0 text-center">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Rental Price
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-4">
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-muted-foreground font-black text-xl">
                  /mo
                </span>
              </div>
            </div>

            <div className="p-8 pt-10 flex flex-col gap-6">
              {listing.profiles && (
                <div className="flex items-center gap-4 rounded-[2rem] bg-muted/40 p-5 border border-border/50 transition-all hover:bg-muted duration-500">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                    {listing.profiles?.full_name?.charAt(0)?.toUpperCase() || (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-foreground tracking-tight leading-none mb-1">
                      {listing.contact_name ||
                        listing.profiles?.full_name ||
                        "Owner"}
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Verified Landlord
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowPhone(true)}
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-lg font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Phone className="h-5 w-5 fill-current animate-pulse" />
                  {showPhone ? listing.contact_phone : "Call Now"}
                </button>

                {listing.contact_email && (
                  <button
                    type="button"
                    onClick={() => setShowEmail(true)}
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-primary/20 py-5 text-lg font-black text-primary hover:bg-primary/5 transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    {showEmail ? listing.contact_email : "Mail Owner"}
                  </button>
                )}
              </div>

              <div className="relative h-px bg-border my-6">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white dark:bg-slate-950 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Inquiry Flow
                </span>
              </div>

              {sent ? (
                <div className="rounded-[2.5rem] bg-emerald-50 p-10 text-center border border-emerald-100 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                    <Check className="h-10 w-10 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-900 tracking-tighter mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-emerald-700/80 font-bold leading-relaxed">
                    The owner has been notified. Expect a quick response.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-[10px] font-black uppercase tracking-widest ml-4"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="Your name"
                      value={inquiryForm.sender_name}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          sender_name: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[10px] font-black uppercase tracking-widest ml-4"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      required
                      placeholder="07X XXX XXXX"
                      value={inquiryForm.sender_phone}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          sender_phone: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[10px] font-black uppercase tracking-widest ml-4"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      required
                      placeholder="I'm interested in viewing this property..."
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      className="rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 font-bold p-6 leading-relaxed"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-16 rounded-2xl font-black text-lg bg-zinc-900 text-white hover:bg-black shadow-xl transition-all"
                  >
                    {sending ? "Sending Message..." : "Schedule Viewing"}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
