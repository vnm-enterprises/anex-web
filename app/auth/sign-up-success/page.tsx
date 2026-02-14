import { Button } from "@/components/ui/button"
import { Mail, Home, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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

        {/* Content */}
        <div className="max-w-md w-full mx-auto text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Check Your Email
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            We've sent you a confirmation link.
            Please verify your email address before signing in to your account.
          </p>

          <Button asChild className="w-full">
            <Link href="/auth/login">
              Go to Login
            </Link>
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            Didn’t receive the email?
            Check your spam folder.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Annex.lk
        </div>
      </div>

      {/* RIGHT SIDE - BRAND VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070"
          alt="Modern Apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
            <span className="text-sm uppercase tracking-wide text-white/80">
              Account Created
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-3">
            You're almost there.
          </h2>

          <p className="text-white/80 max-w-md">
            Verify your email to unlock your dashboard and start listing
            properties or discovering rentals across Sri Lanka.
          </p>

          <div className="flex gap-8 mt-10 border-t border-white/20 pt-8">
            <div>
              <p className="text-2xl font-bold">5,000+</p>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Active Listings
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">12k+</p>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Happy Tenants
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Verified Owners
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
