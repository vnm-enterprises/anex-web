import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Home,
  Eye,
  MessageCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/constants"
import type { Listing } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: listings } = await supabase
    .from("listings")
    .select("*, districts(name), cities(name), listing_images(url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: totalInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in(
      "listing_id",
      (listings || []).map((l: Listing) => l.id)
    )

  const { count: unreadInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in(
      "listing_id",
      (listings || []).map((l: Listing) => l.id)
    )
    .eq("is_read", false)

  const totalViews = (listings || []).reduce(
    (sum: number, l: Listing) => sum + l.views_count,
    0
  )

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {profile?.full_name || "there"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new" className="text-white">
            <PlusCircle className="mr-2 h-4 w-4 text-white" />
            New Listing
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Listings
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalListings || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalViews}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inquiries
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalInquiries || 0}
            </div>
            {(unreadInquiries || 0) > 0 && (
              <p className="text-xs text-accent">
                {unreadInquiries} unread
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">Free</div>
            <Link
              href="/pricing"
              className="text-xs text-primary hover:underline"
            >
              Upgrade
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Your Listings
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-white hover:bg-primary">
            <Link href="/dashboard/listings">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {!listings || listings.length === 0 ? (
          <Card className="border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Home className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">No listings yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Post your first property listing to get started
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/listings/new" className="text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Listing
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map((listing: Listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/listings/${listing.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {listing.listing_images?.[0]?.url ? (
                    <img
                      src={listing.listing_images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Home className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.cities?.name}, {listing.districts?.name}
                  </p>
                </div>
                <div className="hidden items-center gap-4 text-sm md:flex">
                  <span className="font-semibold text-primary">
                    {formatPrice(listing.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {listing.views_count}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {statusIcon(listing.status)}
                  <span className="hidden text-sm capitalize text-muted-foreground sm:inline">
                    {listing.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
