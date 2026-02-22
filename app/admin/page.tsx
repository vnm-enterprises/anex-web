import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageCircle, Eye, Shield, ArrowRight, ArrowLeft, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-4"
          >
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3 w-fit">
             <Shield className="h-3 w-3" />
             Admin Control Center
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">
            Platform <span className="text-primary">Overview</span>
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Monitor system performance and manage pending actions
          </p>
        </div>
      </div>

       {/* Pending Alerts Banner */}
       {(pendingListings || 0) > 0 && (
        <Card className="border-none bg-gradient-to-r from-amber-500/10 via-amber-200/5 to-transparent soft-shadow rounded-[2rem] overflow-hidden group">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 py-8 px-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse">
              <Eye className="h-7 w-7" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-foreground tracking-tight">
                {pendingListings} listing{pendingListings !== 1 ? "s" : ""} awaiting your review
              </h3>
              <p className="text-muted-foreground font-medium mt-1">
                Maintain platform quality by reviewing new submissions promptly.
              </p>
            </div>
            <Button asChild className="rounded-2xl h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20">
              <a href="/admin/listings?status=pending">
                Review Now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="group border-none soft-shadow bg-card hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl bg-muted/50 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">
                    {stat.value.toLocaleString()}
                  </h3>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
