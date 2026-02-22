import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Plus,
  MapPin,
  Eye,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react"
import Link from "next/link"
import { DashboardListingsClient } from "./listings-client"

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: listings } = await supabase
    .from("listings")
    .select("*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardListingsClient listings={listings || []} />
  )
}
