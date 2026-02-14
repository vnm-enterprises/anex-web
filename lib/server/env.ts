import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  SESSION_COOKIE_NAME: z.string().default("annex_access"),
  CSRF_COOKIE_NAME: z.string().default("annex_csrf"),

  FREE_LISTINGS_PER_MONTH: z.coerce.number().int().min(1).default(3),
  FREE_LISTING_EXPIRY_DAYS: z.coerce.number().int().min(1).default(30),
  MAX_LISTING_IMAGES: z.coerce.number().int().min(3).default(12),
  MIN_LISTING_IMAGES: z.coerce.number().int().min(1).default(3),

  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().optional(),
  REDIS_PASSWORD: z.string().optional(),

  RATE_LIMIT_WINDOW_SEC: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_AUTH_MAX_REQUESTS: z.coerce.number().int().positive().default(15),

  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_FORCE_PATH_STYLE: z
    .string()
    .optional()
    .transform((v) => (v ? v === "true" : true)),
  UPLOAD_MAX_MB: z.coerce.number().positive().default(10),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SUCCESS_URL: z.string().url().optional(),
  STRIPE_CANCEL_URL: z.string().url().optional(),

  CRON_SECRET: z.string().min(16).optional(),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${formatted}`);
}

const data = parsed.data;

if (data.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET) {
  throw new Error("Security error: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET must not be set in production.");
}

const redisUrl = data.REDIS_URL
  ?? (data.REDIS_HOST && data.REDIS_PORT
    ? `redis://${data.REDIS_PASSWORD ? `:${data.REDIS_PASSWORD}@` : ""}${data.REDIS_HOST}:${data.REDIS_PORT}`
    : undefined);

export const env = {
  nodeEnv: data.NODE_ENV,
  appUrl: data.NEXT_PUBLIC_APP_URL,

  databaseUrl: data.DATABASE_URL,
  jwtSecret: data.JWT_SECRET,
  jwtExpiresIn: data.JWT_EXPIRES_IN,
  googleClientId: data.GOOGLE_CLIENT_ID,
  googleClientSecret: data.GOOGLE_CLIENT_SECRET,

  cookieSecure: data.NODE_ENV === "production",
  csrfCookieName: data.CSRF_COOKIE_NAME,
  sessionCookieName: data.SESSION_COOKIE_NAME,

  freeListingsPerMonth: data.FREE_LISTINGS_PER_MONTH,
  freeListingExpiryDays: data.FREE_LISTING_EXPIRY_DAYS,
  maxListingImages: data.MAX_LISTING_IMAGES,
  minListingImages: data.MIN_LISTING_IMAGES,

  redisUrl,
  rateLimitWindowSec: data.RATE_LIMIT_WINDOW_SEC,
  rateLimitMaxRequests: data.RATE_LIMIT_MAX_REQUESTS,
  rateLimitAuthMaxRequests: data.RATE_LIMIT_AUTH_MAX_REQUESTS,

  s3Endpoint: data.S3_ENDPOINT,
  s3Region: data.S3_REGION,
  s3AccessKey: data.S3_ACCESS_KEY,
  s3SecretKey: data.S3_SECRET_KEY,
  s3Bucket: data.S3_BUCKET,
  s3ForcePathStyle: data.S3_FORCE_PATH_STYLE,
  uploadMaxBytes: data.UPLOAD_MAX_MB * 1024 * 1024,

  stripeSecretKey: data.STRIPE_SECRET_KEY,
  stripeWebhookSecret: data.STRIPE_WEBHOOK_SECRET,
  stripePublishableKey: data.STRIPE_PUBLISHABLE_KEY,
  stripeSuccessUrl: data.STRIPE_SUCCESS_URL,
  stripeCancelUrl: data.STRIPE_CANCEL_URL,

  cronSecret: data.CRON_SECRET,
  logLevel: data.LOG_LEVEL,
};
