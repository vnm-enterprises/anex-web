import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function AuthHeader() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-6 lg:px-12 lg:py-8">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Home size={18} className="text-background-dark" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">anex.lk</h2>
      </div>

      <Link
        href="/"
        className="group flex items-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
      >
        Return to Home
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </header>
  );
}
