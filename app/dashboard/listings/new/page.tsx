import type { Metadata } from "next"
import { NewListingForm } from "./new-listing-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Create New Listing",
}

export default function NewListingPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </Link>

      <h1 className="font-display text-4xl font-black text-foreground tracking-tighter">
        Create New Listing
      </h1>
      <NewListingForm />
    </div>
  )
}
