import type { Metadata } from "next"
import { SearchClient } from "./search-client"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Search Rentals",
  description:
    "Search and filter rental properties across Sri Lanka. Find annexes, boarding places, apartments, and houses.",
}

export default function SearchPage() {
  return <Suspense fallback={<>Loading</>}>
    <SearchClient />
  </Suspense>
}
