import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(191),
  phone: z.string().min(7).max(32),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().email().max(191),
  password: z.string().min(8).max(72),
});

export const googleSchema = z.object({
  idToken: z.string().min(20),
});

export const createListingSchema = z.object({
  title: z.string().min(8).max(140),
  description: z.string().min(30).max(8000),
  propertyType: z.enum(["ANNEX", "BOARDING", "HOUSE", "APARTMENT"]),
  priceLkr: z.number().int().min(1000),
  districtId: z.number().int().positive(),
  cityId: z.number().int().positive(),
  area: z.string().max(120).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  furnishedStatus: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]),
  genderPreference: z.enum(["ANY", "MALE", "FEMALE"]).optional(),
  contactName: z.string().min(2).max(120),
  contactPhone: z.string().min(7).max(32),
  contactEmail: z.string().email().optional(),
  amenityIds: z.array(z.number().int().positive()).default([]),
  imageUrls: z.array(z.string().url()).default([]),
  imageUploadIds: z.array(z.string().min(10)).default([]),
});

export const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(32),
  message: z.string().min(10).max(1500),
});

export const subscribeSchema = z.object({
  planCode: z.enum(["BASIC", "PRO", "BUSINESS"]),
  months: z.number().int().min(1).max(12).default(1),
});

export const boostSchema = z.object({
  days: z.enum(["7", "14", "30"]).transform(Number),
});

export const featureSchema = z.object({
  days: z.number().int().min(7).max(30).default(7),
});

export const adminModerateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(300).optional(),
});

export const adSchema = z.object({
  title: z.string().min(3).max(140),
  imageUrl: z.string().url(),
  targetUrl: z.string().url(),
  placement: z.enum(["HOME_HERO", "HOME_INLINE", "DISTRICT_TOP", "CITY_TOP", "SEARCH_INLINE"]),
  districtId: z.number().int().positive().optional(),
  cityId: z.number().int().positive().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  isActive: z.boolean().default(true),
});

export const configSchema = z.object({
  freeListingsPerMonth: z.number().int().min(1).max(100),
  freeListingExpiryDays: z.number().int().min(7).max(90),
  maxListingImages: z.number().int().min(3).max(30),
});

export const uploadPresignSchema = z.object({
  purpose: z.enum(["LISTING_IMAGE", "USER_AVATAR"]),
  fileName: z.string().min(3).max(180),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  sizeBytes: z.number().int().positive(),
  listingId: z.string().optional(),
});

export const uploadCompleteSchema = z.object({
  uploadId: z.string().min(10),
  etag: z.string().optional(),
});

export const createCheckoutSchema = z.object({
  type: z.enum(["SUBSCRIPTION", "BOOST", "FEATURE"]),
  amountLkr: z.number().int().positive(),
  currency: z.string().default("LKR"),
  listingId: z.string().optional(),
  subscriptionId: z.string().optional(),
  metadata: z.record(z.string(), z.string()).default({}),
});
