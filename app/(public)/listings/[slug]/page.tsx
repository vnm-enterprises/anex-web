import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { formatPrice } from "@/lib/constants"
import { ListingDetail } from "./listing-detail"

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
        <section className="mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Similar Properties in {listingData.cities?.name}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.slug}`}
                  className="group rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 bg-background"
                >
                  <div className="h-52 w-full overflow-hidden">
                    <img
                      src={item.listing_images?.[0]?.url ?? "/placeholder.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="font-semibold line-clamp-1">
                      {item.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {item.cities?.name}
                    </p>

                    <p className="font-bold text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
