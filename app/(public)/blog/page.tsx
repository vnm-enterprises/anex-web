import type { Metadata } from "next";
import BlogPageClient from "./blog-page-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Rental Tips & Guides Blog",
  description:
    "Read expert rental tips, tenant safety guides, landlord growth playbooks, and legal basics for Sri Lanka rentals.",
  path: "/blog",
  keywords: [
    "Sri Lanka rental blog",
    "tenant tips Sri Lanka",
    "landlord advice",
    "rental safety guides",
  ],
});

export default function BlogPage() {
  return <BlogPageClient />;
}
