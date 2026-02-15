import { AdminSettingsClient } from "./admin-settings-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - Admin",
}

export default function AdminSettingsPage() {
  return <AdminSettingsClient />
}
