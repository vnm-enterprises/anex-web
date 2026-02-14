import { AdminListingsClient } from "./admin-listings-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Listings - Admin",
}

export default function AdminListingsPage() {
  return <AdminListingsClient />
}
