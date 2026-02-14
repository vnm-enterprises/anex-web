import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireRole } from "@/lib/server/request-auth";
import { adminModerateSchema } from "@/lib/server/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return withErrorBoundary(async () => {
    await assertCsrf(request);
    await requireRole("ADMIN");
    const { id } = await context.params;
    const input = adminModerateSchema.parse(await request.json());

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        status: input.status as ListingStatus,
        approvedAt: input.status === "APPROVED" ? new Date() : null,
      },
    });

    return ok({ listing, reason: input.reason ?? null });
  });
}
