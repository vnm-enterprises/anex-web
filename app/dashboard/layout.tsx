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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-muted/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 mt-16 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
