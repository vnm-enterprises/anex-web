import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch all approved listings for dynamic routes
  const { data: listings } = await supabase
    .from("listings")
    .select("slug, updated_at")
    .eq("status", "approved");

  const baseUrl = "https://annex.lk";

  const staticRoutes = [
    "",
    "/search",
    "/pricing",
    "/about-us",
    "/contact-support",
    "/terms-of-service",
    "/privacy-policy",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const dynamicRoutes = (listings ?? []).map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}`,
    lastModified: listing.updated_at || new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
