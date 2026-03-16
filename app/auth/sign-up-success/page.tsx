import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <div className="max-w-md w-full mx-auto text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-4">Check Your Email</h1>

      <p className="text-muted-foreground mb-8 leading-relaxed">
        We've sent you a confirmation link. Please verify your email address before signing in to your account.
      </p>

      <Button asChild className="w-full">
        <Link href="/auth/login">Go to Login</Link>
      </Button>

      <p className="mt-6 text-sm text-muted-foreground">
        Didn&apos;t receive the email? Check your spam folder.
      </p>
    </div>
  );
}
