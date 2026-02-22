import { AdminAnalyticsClient } from "./admin-analytics-client"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Analytics - Admin",
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </Link>
      <AdminAnalyticsClient />
    </div>
  )
}
