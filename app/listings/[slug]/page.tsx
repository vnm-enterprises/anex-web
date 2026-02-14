import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { prisma } from "@/lib/server/prisma";

async function getListing(slug: string) {
  return prisma.listing.findUnique({
    where: { slug },
    include: {
      district: true,
      city: true,
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      owner: { select: { name: true, phone: true } },
      _count: { select: { inquiries: true, favorites: true, views: true } },
    },
  });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await getListing(slug);

  if (!listing) {
    return { title: "Listing not found | Annex.lk" };
  }

  const title = `${listing.title} | ${listing.city.name} | Annex.lk`;
  const description = listing.description.slice(0, 155);
  const image = listing.images[0]?.url ?? "https://annex.lk/og-image.png";
  const canonical = `https://annex.lk/listings/${listing.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [image],
      type: "website",
    },
  };
}

export default async function ListingSeoPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const listing = await getListing(slug);

  if (!listing || listing.status !== ListingStatus.APPROVED || listing.expiresAt < new Date()) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.title,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city.name,
      addressRegion: listing.district.name,
      addressCountry: "LK",
    },
    image: listing.images.map((img: { url: string }) => img.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: listing.priceLkr,
      availability: "https://schema.org/InStock",
      url: `https://annex.lk/listings/${listing.slug}`,
    },
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="mt-2 text-lg">LKR {listing.priceLkr.toLocaleString()}</p>
        <p className="mt-1 text-sm text-slate-600">{listing.city.name}, {listing.district.name}</p>
        <p className="mt-5 whitespace-pre-wrap">{listing.description}</p>
      </main>
      <Footer />
    </>
  );
}
