import { AdminAnalyticsClient } from "./admin-analytics-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics - Admin",
}

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsClient />
}
