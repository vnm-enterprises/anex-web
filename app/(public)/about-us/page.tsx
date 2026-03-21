import type { Metadata } from "next";
import AboutPageClient from "./about-page-client";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Annex.lk",
  description:
    "Learn about Annex.lk's mission to modernize long-term rentals in Sri Lanka with transparent, trusted, and efficient discovery.",
  path: "/about-us",
  image: `${SITE_URL}/media/images/about.png`,
  keywords: [
    "about annex.lk",
    "Sri Lanka rental marketplace",
    "annex.lk mission",
    "rental platform Sri Lanka",
  ],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
