import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex-shrink-0 flex items-center gap-2.5 group"
      aria-label="RENTR Home"
    >
      <div
        className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
        aria-hidden="true"
      >
        <Home className="h-5 w-5" />
      </div>
      <span className="font-extrabold text-2xl tracking-tighter text-foreground">
        RENTR
      </span>
    </Link>
  );
};

export default Logo;
