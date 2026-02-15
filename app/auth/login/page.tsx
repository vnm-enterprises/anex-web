"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, Home } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Wait for session to be available
      await supabase.auth.getSession();

      router.push(redirect);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 xl:p-20 bg-white dark:bg-slate-900 overflow-y-auto">
        {/* Top Navigation (Same as Signup) */}
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
            New here?{" "}
            <Link href="/auth/sign-up" className="text-primary font-semibold">
              Create account
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to manage your listings and dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="text-right text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-primary font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Footer (Same as Signup) */}
        <div className="mt-12 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Annex.lk
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL (Same structure as Signup) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
          alt="Modern Sri Lankan Apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h2 className="text-3xl font-bold mb-3">
            Manage your rentals effortlessly.
          </h2>
          <p className="text-white/80 max-w-md">
            Access your dashboard, boost listings, track inquiries, and grow
            your rental presence across Sri Lanka.
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
  );
}
