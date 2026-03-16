import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AuthErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-3">Authentication Error</h1>

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
  );
}