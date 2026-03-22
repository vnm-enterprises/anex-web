import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth"],
      },
    ],
    sitemap: "https://rentr.lk/sitemap.xml",
    host: "https://rentr.lk",
  };
}
