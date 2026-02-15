import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageCircle, Eye } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalListings },
    { count: pendingListings },
    { count: approvedListings },
    { count: totalInquiries },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      label: "Total Users",
      value: totalUsers || 0,
      icon: Users,
    },
    {
      label: "Total Listings",
      value: totalListings || 0,
      icon: FileText,
    },
    {
      label: "Pending Review",
      value: pendingListings || 0,
      icon: Eye,
    },
    {
      label: "Live Listings",
      value: approvedListings || 0,
      icon: FileText,
    },
    {
      label: "Total Inquiries",
      value: totalInquiries || 0,
      icon: MessageCircle,
    },
  ]

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        Admin Overview
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(pendingListings || 0) > 0 && (
        <Card className="mt-8 border-accent/50 bg-accent/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {pendingListings} listing{pendingListings !== 1 ? "s" : ""} pending review
              </p>
              <a
                href="/admin/listings?status=pending"
                className="text-sm text-primary hover:underline"
              >
                Review now
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
