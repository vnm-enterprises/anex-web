import { UploadPurpose } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { created, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { assertApiRateLimit } from "@/lib/server/route-guards";
import { uploadPresignSchema } from "@/lib/server/validation";
import { buildObjectKey, createSignedUploadUrl } from "@/lib/server/storage";
import { env } from "@/lib/server/env";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:upload:presign");
    await assertCsrf(request);
    const user = await requireUser();

    const input = uploadPresignSchema.parse(await request.json());

    if (input.sizeBytes > env.uploadMaxBytes) {
      return Response.json({ error: `File exceeds ${Math.floor(env.uploadMaxBytes / (1024 * 1024))}MB limit` }, { status: 400 });
    }

    if (input.listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: input.listingId },
        select: { ownerId: true },
      });

      if (!listing || listing.ownerId !== user.id) {
        return Response.json({ error: "Listing not found or not owned by user" }, { status: 403 });
      }
    }

    const objectKey = buildObjectKey({
      userId: user.id,
      purpose: input.purpose,
      fileName: input.fileName,
    });

    const signed = await createSignedUploadUrl({
      objectKey,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    });

    const upload = await prisma.uploadAsset.create({
      data: {
        userId: user.id,
        listingId: input.listingId,
        purpose: input.purpose as UploadPurpose,
        bucket: env.s3Bucket ?? "",
        objectKey,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      },
    });

    return created({
      uploadId: upload.id,
      uploadUrl: signed.uploadUrl,
      fileUrl: signed.fileUrl,
      expiresInSec: 600,
      objectKey,
    });
  });
}
