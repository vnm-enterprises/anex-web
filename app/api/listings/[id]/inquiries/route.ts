import { ListingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { created, fail, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { getRequestUser } from "@/lib/server/request-auth";
import { inquirySchema } from "@/lib/server/validation";
import { assertApiRateLimit } from "@/lib/server/route-guards";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:inquiry:create");
    await assertCsrf(request);
    const { id } = await context.params;
    const input = inquirySchema.parse(await request.json());
    const actor = await getRequestUser();

    const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true, status: true, expiresAt: true } });
    if (!listing || listing.status !== ListingStatus.APPROVED || listing.expiresAt < new Date()) {
      return fail(404, "Listing unavailable");
    }

    const inquiry = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdInquiry = await tx.inquiry.create({
        data: {
          listingId: id,
          senderUserId: actor?.id,
          name: input.name,
          phone: input.phone,
          message: input.message,
        },
      });

      await tx.listingAnalyticsDaily.upsert({
        where: {
          listingId_date: { listingId: id, date: new Date(new Date().toDateString()) },
        },
        update: { inquiryCount: { increment: 1 } },
        create: { listingId: id, date: new Date(new Date().toDateString()), inquiryCount: 1 },
      });

      return createdInquiry;
    });

    return created({ inquiry, notificationQueued: true });
  });
}
