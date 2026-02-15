import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 ">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 mt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
