import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { ListingDetail } from "./listing-detail";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/types";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

const SIMILAR_LISTING_SELECT = `
  id,
  user_id,
  title,
  description,
  slug,
  property_type,
  price,
  district_id,
  city_id,
  area,
  furnished,
  gender_preference,
  contact_phone,
  status,
  is_boosted,
  boost_expires_at,
  boost_weight,
  boost_type,
  is_featured,
  featured_expires_at,
  featured_weight,
  views_count,
  inquiries_count,
  payment_status,
  expires_at,
  custom_city,
  created_at,
  updated_at,
  listing_images(url),
  cities!listings_city_id_fkey(name)
`;

type ListingWithSimilarityKeys = {
  id: string;
  city_id: string | null;
  district_id: string | null;
  property_type: string;
};

async function getSimilarListings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listing: ListingWithSimilarityKeys,
  limit = 4,
): Promise<Listing[]> {
  const collected: Listing[] = [];
  const seenIds = new Set<string>([listing.id]);

  const appendUnique = (items: Listing[] | null) => {
    if (!items) return;
    for (const item of items) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      collected.push(item);
      if (collected.length >= limit) break;
    }
  };

  const queryWithRank = () =>
    supabase
      .from("listings")
      .select(SIMILAR_LISTING_SELECT)
      .eq("status", "approved")
      .order("boost_weight", { ascending: false })
      .order("boost_expires_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

  // 1) Best match: same city and same property type.
  if (listing.city_id) {
    const { data } = await queryWithRank()
      .eq("city_id", listing.city_id)
      .eq("property_type", listing.property_type)
      .neq("id", listing.id)
      .limit(limit);

    appendUnique((data ?? []) as unknown as Listing[]);
  }

  // 2) Fallback: same district and same property type.
  if (collected.length < limit && listing.district_id) {
    const { data } = await queryWithRank()
      .eq("district_id", listing.district_id)
      .eq("property_type", listing.property_type)
      .neq("id", listing.id)
      .limit(limit * 2);

    appendUnique((data ?? []) as unknown as Listing[]);
  }

  // 3) Final fallback: same property type anywhere.
  if (collected.length < limit) {
    const { data } = await queryWithRank()
      .eq("property_type", listing.property_type)
      .neq("id", listing.id)
      .limit(limit * 3);

    appendUnique((data ?? []) as unknown as Listing[]);
  }

  return collected.slice(0, limit);
}

/* ============================= */
/*          METADATA             */
/* ============================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      `
      title,
      description,
      price,
      districts!listings_district_id_fkey(name),
      cities!listings_city_id_fkey(name),
      custom_city,
      listing_images(url)
      `,
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  const data = listing as any;
  const imageUrl = data.listing_images?.[0]?.url;
  const description = `${listing.title} for Rs. ${listing.price?.toLocaleString()}/month in ${data.cities?.name ?? data.custom_city}, ${data.districts?.name}. ${listing.description?.slice(0, 140)}`;

  return {
    title: `${listing.title} | RENTR`,
    description,
    alternates: {
      canonical: `${SITE_URL}/listings/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: listing.title,
      description,
      url: `${SITE_URL}/listings/${slug}`,
      siteName: "RENTR",
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: listing.title }]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/* ============================= */
/*          PAGE                 */
/* ============================= */

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      districts!listings_district_id_fkey(*),
      cities!listings_city_id_fkey(*),
      custom_city,
      listing_images(*),
      listing_amenities(
        amenities(*)
      ),
      profiles!listings_user_id_fkey(
        full_name,
        avatar_url
      )
      `,
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error || !listing) {
    console.error(error);
    notFound();
  }

  const listingData = listing as any;

  // JSON-LD for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: listingData.title,
    description: listingData.description,
    image: listingData.listing_images?.map((img: any) => img.url) || [],
    address: {
      "@type": "PostalAddress",
      addressLocality: listingData.cities?.name ?? listingData.custom_city,
      addressRegion: listingData.districts?.name,
      addressCountry: "LK",
    },
    offers: {
      "@type": "Offer",
      price: listingData.price,
      priceCurrency: "LKR",
      availability: "https://schema.org/InStock",
    },
  };

  /* ============================= */
  /*        VIEW INCREMENT         */
  /* ============================= */

  const { error: rpcError } = await supabase.rpc("increment_views", {
    listing_id: listing.id,
  });

  // ... rest of the component
  if (rpcError) {
    await supabase
      .from("listings")
      .update({
        views_count: (listing.views_count ?? 0) + 1,
      })
      .eq("id", listing.id);
  }

  /* ============================= */
  /*       SIMILAR PROPERTIES      */
  /* ============================= */

  const similar = await getSimilarListings(supabase, {
    id: listing.id,
    city_id: listing.city_id,
    district_id: listing.district_id,
    property_type: listing.property_type,
  });

  /* ============================= */
  /*            RENDER             */
  /* ============================= */

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetail listing={listingData} />

      {similar.length > 0 && (
        <section className="mt-20 border-t border-border pt-20 mb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                  Recommendations
                </span>
                <h2 className="text-4xl font-black text-foreground tracking-tighter">
                  Similar Properties in{" "}
                  <span className="text-primary italic">
                    {listingData.cities?.name ?? listingData.custom_city}
                  </span>
                </h2>
              </div>
              <Link
                href="/search"
                className="text-sm font-black text-primary hover:underline underline-offset-4"
              >
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
  );
}
