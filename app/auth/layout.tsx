import { AuthLayoutShell } from "@/components/auth/auth-layout-shell";

/** Shared layout for all authentication routes. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
