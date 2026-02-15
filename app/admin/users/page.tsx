import { AdminUsersClient } from "./admin-users-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management - Admin",
}

export default function AdminUsersPage() {
  return <AdminUsersClient />
}
