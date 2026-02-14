import { prisma } from "@/lib/server/prisma";
import { ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireRole } from "@/lib/server/request-auth";
import { configSchema } from "@/lib/server/validation";

const DEFAULTS = {
  freeListingsPerMonth: 3,
  freeListingExpiryDays: 30,
  maxListingImages: 12,
};

export async function GET() {
  return withErrorBoundary(async () => {
    await requireRole("ADMIN");

    const rows = await prisma.systemConfig.findMany({
      where: {
        key: { in: ["freeListingsPerMonth", "freeListingExpiryDays", "maxListingImages"] },
      },
    });

    const map = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, Number(r.value)]));

    return ok({
      freeListingsPerMonth: map.freeListingsPerMonth ?? DEFAULTS.freeListingsPerMonth,
      freeListingExpiryDays: map.freeListingExpiryDays ?? DEFAULTS.freeListingExpiryDays,
      maxListingImages: map.maxListingImages ?? DEFAULTS.maxListingImages,
    });
  });
}

export async function PUT(request: Request) {
  return withErrorBoundary(async () => {
    await assertCsrf(request);
    await requireRole("ADMIN");

    const input = configSchema.parse(await request.json());

    await prisma.$transaction([
      prisma.systemConfig.upsert({
        where: { key: "freeListingsPerMonth" },
        update: { value: String(input.freeListingsPerMonth) },
        create: { key: "freeListingsPerMonth", value: String(input.freeListingsPerMonth) },
      }),
      prisma.systemConfig.upsert({
        where: { key: "freeListingExpiryDays" },
        update: { value: String(input.freeListingExpiryDays) },
        create: { key: "freeListingExpiryDays", value: String(input.freeListingExpiryDays) },
      }),
      prisma.systemConfig.upsert({
        where: { key: "maxListingImages" },
        update: { value: String(input.maxListingImages) },
        create: { key: "maxListingImages", value: String(input.maxListingImages) },
      }),
    ]);

    return ok({ ok: true });
  });
}
