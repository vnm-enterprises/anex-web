import { Metadata } from "next";
import Link from "next/link";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

async function getDistrict(slug: string) {
  return prisma.district.findUnique({ where: { slug } });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const district = await getDistrict(slug);
  const title = district ? `${district.name} Rentals | Annex.lk` : "District Rentals | Annex.lk";
  const description = district
    ? `Find annexes, boarding places, apartments and houses for rent in ${district.name}.`
    : "Find rental listings by district in Sri Lanka.";

  return {
    title,
    description,
    alternates: { canonical: `https://annex.lk/district/${slug}` },
  };
}

export default async function DistrictPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const district = await getDistrict(slug);
  if (!district) return <main className="mx-auto max-w-6xl p-8">District not found</main>;

  const listings = await prisma.listing.findMany({
    where: { districtId: district.id, status: ListingStatus.APPROVED, expiresAt: { gte: new Date() } },
    orderBy: [{ isFeatured: "desc" }, { isBoosted: "desc" }, { rankingWeight: "desc" }, { createdAt: "desc" }],
    include: { city: true },
    take: 24,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Rentals in {district.name}</h1>
      <p className="mt-1 text-sm text-slate-600">{listings.length} active listings</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((l: { id: string; slug: string; title: string; priceLkr: number; city: { name: string } }) => (
          <Link href={`/listings/${l.slug}`} key={l.id} className="rounded-lg border p-4 hover:shadow">
            <h2 className="font-semibold">{l.title}</h2>
            <p className="text-sm text-slate-600">{l.city.name}</p>
            <p className="mt-2">LKR {l.priceLkr.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
