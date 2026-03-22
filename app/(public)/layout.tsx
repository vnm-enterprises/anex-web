import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" >
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <SiteHeader />
      <main className="relative z-10 flex-1 min-h-screen">

        {children}</main>
      <SiteFooter />
    </div>
  )
}
