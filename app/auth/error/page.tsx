// app/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 xl:p-20 bg-white dark:bg-slate-900">

        {/* Logo */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Annex.lk
            </span>
          </Link>
        </div>

        {/* Error Content */}
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Authentication Error
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {error || "Something went wrong during authentication. Please try again or return to the homepage."}
          </p>

          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1 h-11">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild className="flex-1 h-11">
              <Link href="/auth/login">Try Again</Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Annex.lk
        </div>
      </div>

      {/* RIGHT SIDE VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070"
          alt="Modern Apartment Interior"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h2 className="text-3xl font-bold mb-4">Let's get you back on track.</h2>
          <p className="text-white/80 max-w-md">
            Authentication issues are usually temporary.
            Try signing in again or return home to continue browsing listings.
          </p>
          <div className="flex gap-8 mt-10 border-t border-white/20 pt-8">
            <div>
              <p className="text-2xl font-bold">5,000+</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">12k+</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Happy Tenants</p>
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Verified Owners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  )
}