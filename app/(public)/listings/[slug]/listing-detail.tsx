"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Eye,
  Calendar,
  Sparkles,
  Zap,
  Home,
  BedDouble,
  Warehouse,
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Check,
  MessageCircle,
  User,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/constants"
import type { Listing } from "@/lib/types"
import { toast } from "sonner"
import Link from "next/link"

const propertyIcons: Record<string, React.ElementType> = {
  annex: Home,
  boarding: BedDouble,
  house: Warehouse,
  apartment: Building2,
}

const amenityIcons: Record<string, string> = {
  wifi: "Wi-Fi",
  wind: "AC",
  car: "Parking",
  flame: "Hot Water",
  shirt: "Washing Machine",
  "cooking-pot": "Kitchen",
  tv: "TV",
  shield: "Security",
  camera: "CCTV",
  zap: "Generator",
  waves: "Pool",
  dumbbell: "Gym",
  trees: "Garden",
  sofa: "Furnished",
  fence: "Balcony",
}

export function ListingDetail({ listing }: { listing: Listing }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [inquiryForm, setInquiryForm] = useState({
    sender_name: "",
    sender_phone: "",
    sender_email: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const images = listing.listing_images || []
  const amenities = listing.listing_amenities || []
  const PropertyIcon = propertyIcons[listing.property_type] || Home

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    const supabase = createClient()
    const { error } = await supabase.from("inquiries").insert({
      listing_id: listing.id,
      ...inquiryForm,
    })

    if (error) {
      toast.error("Failed to send inquiry. Please try again.")
    } else {
      toast.success("Inquiry sent successfully!")
      setSent(true)
    }
    setSending(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Link
        href="/search"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Search
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative overflow-hidden rounded-xl bg-muted">
            {images.length > 0 ? (
              <>
                <div className="aspect-[16/10]">
                  <img
                    src={images[currentImage]?.url}
                    alt={`${listing.title} - Image ${currentImage + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImage(
                          currentImage > 0 ? currentImage - 1 : images.length - 1
                        )
                      }
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur hover:bg-card"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage(
                          currentImage < images.length - 1 ? currentImage + 1 : 0
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md backdrop-blur hover:bg-card"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentImage
                              ? "w-6 bg-primary-foreground"
                              : "w-2 bg-primary-foreground/50"
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center">
                <PropertyIcon className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}

            <div className="absolute left-3 top-3 flex gap-1.5">
              {listing.is_featured && (
                <Badge className="bg-accent text-accent-foreground shadow-sm">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              {listing.is_boosted && (
                <Badge className="bg-primary text-primary-foreground shadow-sm">
                  <Zap className="mr-1 h-3 w-3" />
                  Boosted
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(i)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === currentImage
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="mt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {listing.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {listing.cities?.name}, {listing.districts?.name}
                    {listing.area ? ` - ${listing.area}` : ""}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="secondary" className="capitalize gap-1.5 px-3 py-1 text-sm">
                <PropertyIcon className="h-4 w-4" />
                {listing.property_type}
              </Badge>
              <Badge variant="secondary" className="capitalize gap-1.5 px-3 py-1 text-sm">
                {listing.furnished.replace("-", " ")}
              </Badge>
              {listing.gender_preference !== "any" && (
                <Badge variant="secondary" className="capitalize gap-1.5 px-3 py-1 text-sm">
                  {listing.gender_preference} only
                </Badge>
              )}
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {listing.views_count} views
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Posted {formatDate(listing.created_at)}
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                {listing.inquiries_count} inquiries
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Description
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {amenities.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((la) => (
                    <Badge
                      key={la.amenities.id}
                      variant="outline"
                      className="gap-1.5 px-3 py-1.5 text-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-primary" />
                      {la.amenities.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="sticky top-24 border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-primary">
                  {formatPrice(listing.price)}
                </CardTitle>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {listing.profiles && (
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {listing.profiles.full_name?.charAt(0)?.toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {listing.contact_name || listing.profiles.full_name || "Property Owner"}
                    </p>
                    <p className="text-xs text-muted-foreground">Property Owner</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${listing.contact_phone}`}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {listing.contact_phone}
                </a>
                {listing.contact_email && (
                  <a
                    href={`mailto:${listing.contact_email}`}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    {listing.contact_email}
                  </a>
                )}
              </div>

              <div className="h-px bg-border" />

              {sent ? (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <Check className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-medium text-foreground">Inquiry Sent!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The owner will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="flex flex-col gap-3">
                  <h3 className="font-semibold text-foreground">
                    Send an Inquiry
                  </h3>
                  <div>
                    <Label htmlFor="name" className="text-xs">Name</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      value={inquiryForm.sender_email}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          sender_email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-xs">Message</Label>
                    <Textarea
                      id="message"
                      required
                      placeholder="I'm interested in this property..."
                      rows={3}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full">
                    {sending ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
