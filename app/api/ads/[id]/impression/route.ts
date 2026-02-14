import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { getRequestUser } from "@/lib/server/request-auth";

const bodySchema = z.object({
  listingId: z.string().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = bodySchema.parse(await request.json().catch(() => ({})));
  const user = await getRequestUser();

  await prisma.adImpression.create({
    data: {
      adId: id,
      listingId: body.listingId,
      userId: user?.id,
    },
  });

  return Response.json({ ok: true });
}
