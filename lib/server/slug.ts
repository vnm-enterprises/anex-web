import { prisma } from "@/lib/server/prisma";

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createUniqueListingSlug(base: string) {
  const raw = toSlug(base) || "listing";
  let slug = raw;
  let i = 1;

  while (true) {
    const exists = await prisma.listing.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!exists) return slug;
    i += 1;
    slug = `${raw}-${i}`;
  }
}
