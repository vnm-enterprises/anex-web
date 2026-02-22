import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  MapPin,
  Calendar,
  Home,
  CheckCircle,
  Eye,
  MessageCircle,
  Sparkles,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/constants"

/* ================= PAGE ================= */

export default async function DashboardListingPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: listing, error } = await supabase
    .from("listings")
    .select(`
      *,
      districts(name),
      cities(name),
      listing_images!left(
        id,
        url,
        display_order
      ),
      listing_amenities!left(
        amenities(id, name)
      ),
     inquiries:inquiries!left(
  id,
  message,
  sender_phone,
  created_at,
  is_read
)

    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !listing) {
    redirect("/dashboard")
  }

  /* ================= FILTER INQUIRIES ================= */

  const unreadInquiries =
    listing.inquiries?.filter((i: any) => !i.is_read) || []


  async function markAsRead(formData: FormData) {
  "use server"

  const inquiryId = formData.get("inquiry_id") as string
  const supabase = await createClient()

  await supabase
    .from("inquiries")
    .update({ is_read: true })
    .eq("id", inquiryId)
}


  /* ================= DELETE ================= */

  async function deleteListing() {
    "use server"

    const supabase = await createClient()

    await supabase
      .from("listings")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id)

    redirect("/dashboard")
  }

  const statusColor = {
    approved: "bg-primary/10 text-primary",
    pending: "bg-accent/10 text-accent",
    rejected: "bg-destructive/10 text-destructive",
    expired: "bg-muted text-muted-foreground",
  } as Record<string, string>

  return (
    <div className="space-y-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </Link>

      {/* ================= HERO ================= */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge
              className={`${statusColor[listing.status] || ""} border-0 capitalize px-3 py-1`}
            >
              {listing.status}
            </Badge>

            <span className="text-sm text-muted-foreground">
              ID: {listing.id.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {listing.cities?.name}, {listing.districts?.name}
            </span>

            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {listing.property_type}
            </span>

            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(listing.created_at)}
            </span>
          </div>

          <div className="text-3xl font-semibold text-primary pt-2">
            {formatPrice(listing.price)}
          </div>
        </div>

        <form action={deleteListing}>
          <Button
            variant="destructive"
            className="rounded-xl px-6"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Listing
          </Button>
        </form>

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* IMAGE GALLERY */}
          {listing.listing_images?.length > 0 && (
            <div className="space-y-4">

              <div className="rounded-2xl overflow-hidden border shadow-sm">
                <img
                  src={listing.listing_images[0].url}
                  className="w-full h-[420px] object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {listing.listing_images.slice(1).map((img: any) => (
                  <img
                    key={img.id}
                    src={img.url}
                    className="rounded-xl border object-cover h-24 w-full"
                  />
                ))}
              </div>

            </div>
          )}

          {/* DESCRIPTION */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </CardContent>
          </Card>

          {/* AMENITIES */}
          {listing.listing_amenities?.length > 0 && (
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {listing.listing_amenities.map((item: any, i: number) => (
                  <Badge
                    key={i}
                    variant="default"
                    className="rounded-full px-3 py-1 bg-primary text-white"
                  >
                    {item.amenities?.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">

          {/* DETAILS */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Detail label="Furnished">
                {listing.furnished}
              </Detail>
              <Detail label="Gender Preference">
                {listing.gender_preference}
              </Detail>
              <Detail label="Expires">
                {formatDate(listing.expires_at)}
              </Detail>
            </CardContent>
          </Card>

          {/* CONTACT */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Detail label="Name">
                {listing.contact_name || "—"}
              </Detail>
              <Detail label="Phone">
                {listing.contact_phone}
              </Detail>
              <Detail label="Email">
                {listing.contact_email || "—"}
              </Detail>
            </CardContent>
          </Card>

          {/* STATS */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="py-6 space-y-6">
              <StatRow
                icon={<Eye className="h-5 w-5 text-primary" />}
                label="Views"
                value={listing.views_count}
              />
              <StatRow
                icon={<MessageCircle className="h-5 w-5 text-accent" />}
                label="Inquiries"
                value={listing.inquiries?.length || 0}

              />
              <StatRow
                icon={<Sparkles className="h-5 w-5 text-accent" />}
                label="Status"
                value={listing.status}
              />
            </CardContent>
          </Card>

        </div>

      </div>

{/* ================= UNREAD INQUIRIES ================= */}
<Card className="rounded-2xl shadow-sm">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Unread Inquiries</CardTitle>
    <Badge variant="default">
      {unreadInquiries.length}
    </Badge>
  </CardHeader>

  <CardContent className="space-y-6">

    {unreadInquiries.length === 0 && (
      <div className="text-center py-10 text-muted-foreground text-sm">
        🎉 No unread inquiries
      </div>
    )}

    {listing.inquiries?.map((inq: any) => (
      <div
        key={inq.id}
        className={`rounded-2xl border p-6 transition-all duration-300 ${
          inq.is_read
            ? 'bg-card border-border/50 opacity-70'
            : 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span className={inq.is_read ? '' : 'text-primary'}>
                {inq.sender_phone}
              </span>
              <span>
                {formatDate(inq.created_at)}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${inq.is_read ? 'text-muted-foreground font-medium' : 'text-foreground font-bold'}`}>
              {inq.message}
            </p>
          </div>

          <form action={markAsRead}>
            <input type="hidden" name="inquiry_id" value={inq.id} />
            <Button
              type="submit"
              size="sm"
              variant={inq.is_read ? "ghost" : "outline"}
              disabled={inq.is_read}
              className={`rounded-xl font-black text-[10px] uppercase tracking-widest px-4 ${
                inq.is_read ? 'text-emerald-500 cursor-default hover:bg-transparent' : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {inq.is_read ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  Read
                </>
              ) : "Mark as Read"}
            </Button>
          </form>
        </div>
      </div>
    ))}

  </CardContent>
</Card>


    </div>
  )
}

/* ================= COMPONENTS ================= */

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: any
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground text-sm">
          {label}
        </span>
      </div>
      <span className="font-semibold">
        {value}
      </span>
    </div>
  )
}
