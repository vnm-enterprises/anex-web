import type { Metadata } from "next"
import { SearchClient } from "./search-client"
import { Suspense } from "react"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Search Rentals",
  description:
    "Search and filter rental properties across Sri Lanka by district, city, price, property type, furnished status, and gender preference.",
  path: "/search",
  keywords: [
    "search rentals Sri Lanka",
    "filter rentals by district",
    "apartment search Sri Lanka",
  ],
})

export default function SearchPage() {
  return <Suspense fallback={<>Loading</>}>
    <SearchClient />
  </Suspense>
}
