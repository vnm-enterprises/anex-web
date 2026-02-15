"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { formatDate } from "@/lib/constants"

export function AdminAnalyticsClient() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  const fetchAnalytics = async () => {
    setLoading(true)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      { count: totalUsers },
      { count: newUsers },
      { count: totalListings },
      { count: approved },
      { count: pending },
      { count: rejected },
      { count: boosted },
      { count: featured },
      { data: recentListings },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),

      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),

      supabase.from("listings").select("*", { count: "exact", head: true }),

      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),

      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected"),

      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("is_boosted", true),

      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("is_featured", true),

      supabase
        .from("listings")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString()),
    ])

    // Prepare daily listing counts
    const grouped: Record<string, number> = {}

    recentListings?.forEach((item) => {
      const date = new Date(item.created_at).toDateString()
      grouped[date] = (grouped[date] || 0) + 1
    })

    const chart = Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }))

    setStats({
      totalUsers,
      newUsers,
      totalListings,
      approved,
      pending,
      rejected,
      boosted,
      featured,
    })

    setChartData(chart)
    setLoading(false)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10">

      <h1 className="font-display text-3xl font-bold">
        Platform Analytics
      </h1>

      {/* === METRIC CARDS === */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard title="Total Users" value={stats.totalUsers} />
        <MetricCard title="New Users (7d)" value={stats.newUsers} />
        <MetricCard title="Total Listings" value={stats.totalListings} />
        <MetricCard title="Approved Listings" value={stats.approved} />
        <MetricCard title="Pending Listings" value={stats.pending} />
        <MetricCard title="Rejected Listings" value={stats.rejected} />
        <MetricCard title="Boosted Listings" value={stats.boosted} />
        <MetricCard title="Featured Listings" value={stats.featured} />

      </div>

      {/* === LISTING ACTIVITY === */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Listings Created (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No listings created in last 7 days.
            </p>
          ) : (
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.date} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-muted-foreground">
                    {formatDate(item.date)}
                  </div>

                  <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-3"
                      style={{
                        width: `${item.count * 10}%`,
                      }}
                    />
                  </div>

                  <div className="w-6 text-sm font-medium">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value || 0}
        </div>
      </CardContent>
    </Card>
  )
}
