import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import { createPublicServerClient } from "@/lib/supabase/public-server";

const LISTING_PREVIEW_SELECT =
  "id,title,description,slug,price,furnished,gender_preference,views_count,status,is_boosted,boost_weight,boost_expires_at,boost_type,is_featured,featured_expires_at,featured_weight,payment_status,custom_city,cities(name),listing_images(url),listing_amenities(amenities(name))";

const PROMINENT_DISTRICTS = [
  { slug: "colombo", name: "Colombo" },
  { slug: "kandy", name: "Kandy" },
  { slug: "galle", name: "Galle" },
  { slug: "gampaha", name: "Gampaha" },
  { slug: "kalutara", name: "Kalutara" },
  { slug: "kurunegala", name: "Kurunegala" },
];

const DISTRICT_IMAGES: Record<string, string> = {
  colombo: "/media/images/colombo.png",
  kandy: "/media/images/kandy.png",
  galle: "/media/images/galle.png",
  gampaha: "/media/images/gampaha.png",
  kalutara: "/media/images/kaluthara.png",
  kurunegala: "/media/images/kurunegala.png",
};

const getHomePayload = unstable_cache(
  async () => {
    const supabase = createPublicServerClient();
    const nowIso = new Date().toISOString();

    const [districtsRes, featuredRes, handpickedRes, listingsCountRes, tenantsCountRes] =
      await Promise.all([
        supabase.from("districts").select("id,name,slug").order("name"),
        supabase
          .from("listings")
          .select(LISTING_PREVIEW_SELECT)
          .eq("status", "approved")
          .gt("boost_weight", 0)
          .or(`boost_expires_at.is.null,boost_expires_at.gt.${nowIso}`)
          .order("boost_weight", { ascending: false })
          .order("boost_expires_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("listings")
          .select(LISTING_PREVIEW_SELECT)
          .eq("status", "approved")
          .eq("is_featured", false)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("listings")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "user"),
      ]);

    if (districtsRes.error) throw districtsRes.error;
    if (featuredRes.error) throw featuredRes.error;
    if (handpickedRes.error) throw handpickedRes.error;
    if (listingsCountRes.error) throw listingsCountRes.error;
    if (tenantsCountRes.error) throw tenantsCountRes.error;

    const districts = districtsRes.data ?? [];
    const prominentSlugSet = new Set(PROMINENT_DISTRICTS.map((d) => d.slug));

    const prominentDistricts = await Promise.all(
      districts
        .filter((district) => prominentSlugSet.has(district.slug.toLowerCase()))
        .map(async (district) => {
          const { count, error } = await supabase
            .from("listings")
            .select("id", { count: "exact", head: true })
            .eq("district_id", district.id)
            .eq("status", "approved");

          if (error) {
            throw error;
          }

          return {
            ...district,
            image:
              DISTRICT_IMAGES[district.slug.toLowerCase()] ||
              "https://images.unsplash.com/photo-1580000000000?auto=format&fit=crop&q=80&w=800",
            count: count ?? 0,
          };
        }),
    );

    return {
      heroDistricts: districts,
      prominentDistricts,
      featuredListings: featuredRes.data ?? [],
      handpickedListings: handpickedRes.data ?? [],
      marketplaceStats: {
        listingsCount: listingsCountRes.count ?? 0,
        tenantsCount: tenantsCountRes.count ?? 0,
      },
      generatedAt: new Date().toISOString(),
    };
  },
  ["public-home-payload"],
  { revalidate: 60, tags: ["public-home"] },
);

export async function GET() {
  try {
    const payload = await getHomePayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load home payload",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
