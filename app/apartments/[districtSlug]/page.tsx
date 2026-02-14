import { Metadata } from "next";
import Link from "next/link";
import { ListingStatus, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export async function generateMetadata(props: { params: Promise<{ districtSlug: string }> }): Promise<Metadata> {
  const { districtSlug } = await props.params;
  return {
    title: `Apartments in ${districtSlug} | Annex.lk`,
    description: `Find apartments for rent in ${districtSlug} district on Annex.lk.`,
    alternates: { canonical: `https://annex.lk/apartments/${districtSlug}` },
  };
}

export default async function ApartmentsByDistrictPage(props: { params: Promise<{ districtSlug: string }> }) {
  const { districtSlug } = await props.params;

  const district = await prisma.district.findUnique({ where: { slug: districtSlug } });
  if (!district) return <main className="mx-auto max-w-6xl p-8">District not found</main>;

  const listings = await prisma.listing.findMany({
    where: {
      districtId: district.id,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.APPROVED,
      expiresAt: { gte: new Date() },
    },
    orderBy: [{ isFeatured: "desc" }, { isBoosted: "desc" }, { rankingWeight: "desc" }, { createdAt: "desc" }],
    take: 30,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Apartments in {district.name}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((l: { id: string; slug: string; title: string; priceLkr: number }) => (
          <Link href={`/listings/${l.slug}`} key={l.id} className="rounded-lg border p-4 hover:shadow">
            <h2 className="font-semibold">{l.title}</h2>
            <p className="mt-2">LKR {l.priceLkr.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
