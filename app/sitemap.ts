import { MetadataRoute } from "next";
import { prisma } from "@/lib/server/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [districts, cities, listings] = await Promise.all([
    prisma.district.findMany({ select: { slug: true, createdAt: true } }),
    prisma.city.findMany({ select: { slug: true, createdAt: true } }),
    prisma.listing.findMany({
      where: { status: "APPROVED", expiresAt: { gte: new Date() } },
      select: { slug: true, updatedAt: true },
      take: 15000,
    }),
  ]);

  return [
    {
      url: "https://annex.lk",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...districts.map((d: { slug: string; createdAt: Date }) => ({
      url: `https://annex.lk/district/${d.slug}`,
      lastModified: d.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...cities.map((c: { slug: string; createdAt: Date }) => ({
      url: `https://annex.lk/city/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...listings.map((l: { slug: string; updatedAt: Date }) => ({
      url: `https://annex.lk/listings/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
