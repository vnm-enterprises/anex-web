import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ListingDetail } from "./listing-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: listing } = await supabase
    .from("listings")
    .select("title, description, price, districts(name), cities(name)")
    .eq("slug", slug)
    .eq("status", "approved")
    .single()

  if (!listing) return { title: "Listing Not Found" }

  return {
    title: listing.title,
    description: `${listing.title} for Rs. ${listing.price?.toLocaleString()}/month in ${listing.cities?.name}, ${listing.districts?.name}. ${listing.description?.slice(0, 120)}`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 200),
    },
  }
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from("listings")
    .select(
      `*, districts(*), cities(*), listing_images(*), listing_amenities(amenities(*)), profiles(full_name, avatar_url)`
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single()

  if (!listing) notFound()

  // Increment views
  await supabase.rpc("increment_views" as never, { listing_id: listing.id } as never).catch(() => {
    // fallback: direct update
    supabase.from("listings").update({ views_count: listing.views_count + 1 }).eq("id", listing.id)
  })

  return <ListingDetail listing={listing} />
}
