import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { PostAdButton } from "@/components/home/post-ad-button"

export function CtaSection() {
  return (
    <section className="px-4 py-20 lg:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl">
          Ready to Find Your Next Home?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Whether you{"'"}re looking for a place or listing your property, Annex.lk
          makes it simple and effective.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/search">
              <Search className="h-5 w-5" />
              Browse Listings
            </Link>
          </Button>
          <PostAdButton className="gap-2" />
        </div>
      </div>
    </section>
  )
}
