import { randomUUID } from "node:crypto";
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";

let s3Client: S3Client | null = null;

export function getS3Client() {
  if (s3Client) return s3Client;

  if (!env.s3Bucket || !env.s3AccessKey || !env.s3SecretKey || !env.s3Endpoint) {
    throw new HttpError(500, "S3 upload is not configured");
  }

  s3Client = new S3Client({
    region: env.s3Region,
    endpoint: env.s3Endpoint,
    forcePathStyle: env.s3ForcePathStyle,
    credentials: {
      accessKeyId: env.s3AccessKey,
      secretAccessKey: env.s3SecretKey,
    },
  });

  return s3Client;
}

export function buildObjectKey(input: { userId: string; purpose: string; fileName: string }) {
  const safeName = input.fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .slice(-120);

  return `${input.purpose.toLowerCase()}/${input.userId}/${Date.now()}-${randomUUID()}-${safeName}`;
}

export async function createSignedUploadUrl(input: {
  objectKey: string;
  mimeType: string;
  sizeBytes: number;
}) {
  if (!env.s3Bucket) {
    throw new HttpError(500, "S3 bucket not configured");
  }

  const command = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: input.objectKey,
    ContentType: input.mimeType,
    ContentLength: input.sizeBytes,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 60 * 10 });
  const fileUrl = `${env.s3Endpoint?.replace(/\/$/, "")}/${env.s3Bucket}/${input.objectKey}`;

  return { uploadUrl, fileUrl };
}
