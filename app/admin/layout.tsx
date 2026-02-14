import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/dashboard")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
