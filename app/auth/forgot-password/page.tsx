"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2, Home } from "lucide-react"

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password reset link sent to your email.")
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">

      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 xl:p-20 bg-white dark:bg-slate-900 overflow-y-auto">

        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Annex.lk
            </span>
          </Link>

          <div className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/auth/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Reset your password
          </h1>
          <p className="text-muted-foreground mb-8">
            Enter your email address and we'll send you a reset link.
          </p>

          <form onSubmit={handleReset} className="space-y-5">

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {message && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Annex.lk
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
          alt="Modern Sri Lankan Apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h2 className="text-3xl font-bold mb-3">
            Secure access to your account.
          </h2>
          <p className="text-white/80 max-w-md">
            We’ll send you a secure link so you can reset your password and
            continue managing your listings.
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
