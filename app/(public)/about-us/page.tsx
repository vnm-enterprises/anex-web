import type { Metadata } from "next";
import AboutPageClient from "./about-page-client";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About RENTR",
  description:
    "Learn about RENTR's mission to modernize long-term rentals in Sri Lanka with transparent, trusted, and efficient discovery.",
  path: "/about-us",
  image: `${SITE_URL}/media/images/about.png`,
  keywords: [
    "about RENTR",
    "Sri Lanka rental marketplace",
    "RENTR mission",
    "rental platform Sri Lanka",
  ],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
