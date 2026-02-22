import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { formatPrice } from "@/lib/constants"
import { ListingDetail } from "./listing-detail"
import { ListingCard } from "@/components/listing-card"

interface Props {
  params: Promise<{ slug: string }>
}

/* ============================= */
/*          METADATA             */
/* ============================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from("listings")
    .select(
      `
      title,
      description,
      price,
      districts!listings_district_id_fkey(name),
      cities!listings_city_id_fkey(name)
      `
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single()

  if (!listing) {
    return { title: "Listing Not Found" }
  }

  const data = listing as any

  return {
    title: listing.title,
    description: `${listing.title} for Rs. ${listing.price?.toLocaleString()}/month in ${data.cities?.name}, ${data.districts?.name}. ${listing.description?.slice(0, 140)}`,
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 200),
    },
  }
}

/* ============================= */
/*          PAGE                 */
/* ============================= */

export default async function ListingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      districts!listings_district_id_fkey(*),
      cities!listings_city_id_fkey(*),
      listing_images(*),
      listing_amenities(
        amenities(*)
      ),
      profiles!listings_user_id_fkey(
        full_name,
        avatar_url
      )
      `
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single()

  if (error || !listing) {
    console.error(error)
    notFound()
  }

  const listingData = listing as any

  /* ============================= */
  /*        VIEW INCREMENT         */
  /* ============================= */

  const { error: rpcError } = await supabase.rpc("increment_views", {
    listing_id: listing.id,
  })

  if (rpcError) {
    await supabase
      .from("listings")
      .update({
        views_count: (listing.views_count ?? 0) + 1,
      })
      .eq("id", listing.id)
  }

  /* ============================= */
  /*       SIMILAR PROPERTIES      */
  /* ============================= */

  const { data: similarListings } = await supabase
    .from("listings")
    .select(
      `
      id,
      slug,
      title,
      price,
      listing_images(url),
      cities!listings_city_id_fkey(name)
      `
    )
    .eq("status", "approved")
    .eq("city_id", listing.city_id)
    .eq("property_type", listing.property_type)
    .neq("id", listing.id)
    .limit(4)

  const similar = (similarListings ?? []) as any[]

  /* ============================= */
  /*            RENDER             */
  /* ============================= */

  return (
    <>
      <ListingDetail listing={listingData} />

      {similar.length > 0 && (
        <section className="mt-20 border-t border-border pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                    Recommendations
                  </span>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter">
                    Similar Properties in <span className="text-primary italic">{listingData.cities?.name}</span>
                  </h2>
               </div>
               <Link href="/search" className="text-sm font-black text-primary hover:underline underline-offset-4">
                 View all listings
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similar.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
