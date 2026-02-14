import type { Metadata } from "next"
import { NewListingForm } from "./new-listing-form"

export const metadata: Metadata = {
  title: "Create New Listing",
}

export default function NewListingPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        Create New Listing
      </h1>
      <NewListingForm />
    </div>
  )
}
