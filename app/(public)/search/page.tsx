import type { Metadata } from "next"
import { SearchClient } from "./search-client"

export const metadata: Metadata = {
  title: "Search Rentals",
  description:
    "Search and filter rental properties across Sri Lanka. Find annexes, boarding places, apartments, and houses.",
}

export default function SearchPage() {
  return <SearchClient />
}
