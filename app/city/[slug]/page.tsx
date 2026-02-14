import { Metadata } from "next";
import Link from "next/link";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

async function getCity(slug: string) {
  return prisma.city.findFirst({ where: { slug }, include: { district: true } });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const city = await getCity(slug);

  return {
    title: city ? `${city.name} Rentals | Annex.lk` : "City Rentals | Annex.lk",
    description: city
      ? `Explore long-term rental listings in ${city.name}, ${city.district.name}.`
      : "Explore rental listings by city in Sri Lanka.",
    alternates: { canonical: `https://annex.lk/city/${slug}` },
  };
}

export default async function CityPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const city = await getCity(slug);
  if (!city) return <main className="mx-auto max-w-6xl p-8">City not found</main>;

  const listings = await prisma.listing.findMany({
    where: { cityId: city.id, status: ListingStatus.APPROVED, expiresAt: { gte: new Date() } },
    orderBy: [{ isFeatured: "desc" }, { isBoosted: "desc" }, { rankingWeight: "desc" }, { createdAt: "desc" }],
    take: 24,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{city.name} Rentals</h1>
      <p className="mt-1 text-sm text-slate-600">{city.district.name} District</p>
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
