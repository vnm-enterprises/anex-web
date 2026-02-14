import { prisma } from "@/lib/server/prisma";
import { ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { assertApiRateLimit } from "@/lib/server/route-guards";
import { uploadCompleteSchema } from "@/lib/server/validation";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:upload:complete");
    await assertCsrf(request);
    const user = await requireUser();
    const input = uploadCompleteSchema.parse(await request.json());

    const upload = await prisma.uploadAsset.findUnique({ where: { id: input.uploadId } });

    if (!upload || upload.userId !== user.id) {
      return Response.json({ error: "Upload not found" }, { status: 404 });
    }

    await prisma.uploadAsset.update({
      where: { id: upload.id },
      data: {
        isCompleted: true,
        etag: input.etag,
      },
    });

    return ok({ ok: true, uploadId: upload.id });
  });
}
