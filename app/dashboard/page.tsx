import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Shield,
  Sparkles,
  FileText,
  Settings,
  Bolt,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import EditProfileButton from "./profile/EditProfileButton";
import { ProfileModalWrapper } from "@/components/dashboard/profile-modal-wrapper";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "*, districts(name), cities(name), custom_city, listing_images(url)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get all listing IDs for the user
  const { data: userListingIds } = await supabase
    .from("listings")
    .select("id")
    .eq("user_id", user.id);

  const listingIds = (userListingIds || []).map((l) => l.id);

  const { count: totalInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("listing_id", listingIds);

  const { count: unreadInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("listing_id", listingIds)
    .eq("is_read", false);

  const totalViews = (listings || []).reduce(
    (sum: number, l: Listing) => sum + l.views_count,
    0,
  );

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Shield className="h-3 w-3" />
            User Dashboard
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">
            Welcome back,{" "}
            <span className="text-primary">
              {profile?.full_name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Manage your listings and track your performance
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="rounded-2xl shadow-xl shadow-primary/20"
        >
          <Link href="/dashboard/listings/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Post New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Listings",
            value: totalListings || 0,
            icon: Home,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Views",
            value: totalViews,
            icon: Eye,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Active Inquiries",
            value: totalInquiries || 0,
            icon: MessageCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            unread: unreadInquiries,
          },
          {
            label: "Current Plan",
            value: "Premium Early Bird",
            icon: Sparkles,
            color: "text-primary",
            bg: "bg-primary/10",
            sub: "Upgrade",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group border-none soft-shadow bg-card hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden relative"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.unread !== undefined &&
                  stat.unread !== null &&
                  stat.unread > 0 && (
                    <span className="bg-destructive text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                      {stat.unread} New
                    </span>
                  )}
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </h3>
                  {stat.sub && (
                    <Link
                      href="/pricing"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {stat.sub}
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
            {stat.label === "Active Inquiries" && (
              <Link
                href="/dashboard/all-inquiries"
                className="absolute inset-0 z-10"
              />
            )}
            {stat.label === "Total Listings" && (
              <Link
                href="/dashboard/listings"
                className="absolute inset-0 z-10"
              />
            )}
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Your Recent Listings
            </h2>
            <Button
              variant="ghost"
              asChild
              className="font-bold text-primary hover:bg-primary/5"
            >
              <Link href="/dashboard/listings">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!listings || listings.length === 0 ? (
            <Card className="border-2 border-dashed border-border bg-transparent rounded-3xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-6 rounded-full bg-muted/50 mb-6">
                  <Home className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  No listings yet
                </h3>
                <p className="mt-2 text-muted-foreground font-medium max-w-sm">
                  Ready to rent out your property? Create your first listing and
                  reach thousands of potential tenants.
                </p>
                <Button
                  asChild
                  className="mt-8 rounded-2xl px-10 h-14"
                  size="lg"
                >
                  <Link href="/dashboard/listings/new">Start Listing Now</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {listings.map((listing: Listing) => (
                <Link
                  key={listing.id}
                  href={`/dashboard/listings/${listing.id}`}
                  className="group flex flex-col md:flex-row items-center gap-6 rounded-[2rem] border border-border bg-card p-5 transition-all duration-300 soft-shadow hover:shadow-xl hover:border-primary/20"
                >
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-inner relative">
                    {listing.listing_images?.[0]?.url ? (
                      <img
                        src={listing.listing_images[0].url}
                        alt={listing.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Home className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h3 className="font-black text-lg text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      {listing.is_boosted && (
                        <span className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bolt className="h-2 w-2 fill-current" />
                          Boosted
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        Rs {(listing.price / 1000).toFixed(0)}k{" "}
                        <span className="text-[10px] text-muted-foreground">
                          /mo
                        </span>
                      </span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />{" "}
                        {listing.cities?.name ?? listing.custom_city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 md:border-x border-border">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                        Views
                      </p>
                      <span className="text-xl font-black text-foreground leading-none">
                        {listing.views_count}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pr-2">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest
                      ${
                        listing.status === "approved"
                          ? "bg-primary/10 text-primary"
                          : listing.status === "pending"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {statusIcon(listing.status)}
                      {listing.status}
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info/Activity */}
        <div className="space-y-6">
          <Card className="border-none soft-shadow bg-card rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-border bg-muted/20">
              <CardTitle className="text-lg font-black tracking-tighter flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link
                href="/dashboard/all-inquiries"
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white soft-shadow text-muted-foreground group-hover:text-primary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-sm text-foreground group-hover:text-primary">
                    All Inquiries
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <div className="flex items-center gap-4 pt-2">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
                  {profile?.full_name?.[0] || "U"}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">
                    {profile?.full_name || "Anonymous User"}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {profile?.role || "Basic"} User
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Account Status
                  </span>
                  <span className="text-primary font-bold">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Joined
                  </span>
                  <span className="text-foreground font-bold">
                    {formatDate(profile?.created_at)}
                  </span>
                </div>
              </div>
              <EditProfileButton />
            </CardContent>
          </Card>

          <Card className="border-none soft-shadow bg-gradient-to-br from-primary to-emerald-600 rounded-3xl overflow-hidden text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-black tracking-tighter mb-4">
                Grow your business
              </h3>
              <p className="text-white/80 font-medium text-sm mb-6 leading-relaxed">
                Boost your listings to appear at the top of search results and
                get up to 10x more inquiries.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-black h-12 shadow-xl">
                Explore Boosting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileModalWrapper initialProfile={profile} />
    </div>
  );
}
