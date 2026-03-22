import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "full" | "text" | "compact";
type LogoTone = "dark" | "light";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  tone?: LogoTone;
  href?: string;
  className?: string;
}

const sizeStyles: Record<LogoSize, { icon: string; text: string; gap: string; badge: string }> = {
  sm: {
    icon: "h-9 w-9 rounded-xl",
    text: "text-2xl",
    gap: "gap-2.5",
    badge: "h-2.5 w-2.5",
  },
  md: {
    icon: "h-11 w-11 rounded-2xl",
    text: "text-3xl",
    gap: "gap-3",
    badge: "h-3 w-3",
  },
  lg: {
    icon: "h-14 w-14 rounded-2xl",
    text: "text-5xl",
    gap: "gap-3.5",
    badge: "h-3.5 w-3.5",
  },
};

const Logo = ({
  size = "sm",
  variant = "full",
  tone = "dark",
  href = "/",
  className,
}: LogoProps) => {
  const styles = sizeStyles[size];
  const mainText = tone === "light" ? "text-white" : "text-[#111827]";
  const secondaryText = tone === "light" ? "text-white/70" : "text-[#111827]/88";

  const icon = (
    <div
      className={cn(
        "relative isolate grid place-items-center bg-gradient-to-br from-primary to-primary shadow-[0_10px_24px_rgba(79,70,229,0.34)] ring-1 ring-white/20",
        styles.icon,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        className="h-[70%] w-[70%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 7C17.1 7 12 12 12 18.6C12 27.6 24 40 24 40C24 40 36 27.6 36 18.6C36 12 30.9 7 24 7Z"
          stroke="white"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
        <path
          d="M18.6 22.2L24 17.8L29.4 22.2V29.6H18.6V22.2Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path d="M22.2 29.6V24.8H25.8V29.6" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span
        className={cn(
          "absolute -right-0.5 -top-0.5 rounded-full bg-primary ring-2 ring-[#F9FAFB]",
          styles.badge,
        )}
      />
    </div>
  );

  const wordmark = (
    <div className="leading-none">
      <div
        className={cn(
          "font-black tracking-[-0.045em] text-primary",
                  )}
      >
        RENT<span className="text-primary">R</span>
      </div>
      <div className={cn("mt-1 h-0.5 w-12 rounded-full bg-primary/70", size === "lg" && "w-16", tone === "light" && "bg-primary/90")} />
    </div>
  );

  const textOnly = (
    <div className="leading-none">
      <span className={cn("font-black tracking-[-0.05em]", styles.text, mainText)}>
        RENT<span className="text-primary">R</span>
      </span>
      <span className={cn("ml-2 align-middle text-[10px] font-bold uppercase tracking-[0.2em]", secondaryText)}>
        Rentals
      </span>
    </div>
  );

  const content = (
    <span className={cn("inline-flex shrink-0 items-center", styles.gap, className)}>
      {variant !== "text" && icon}
      {variant !== "compact" ? (variant === "text" ? textOnly : wordmark) : null}
    </span>
  );

  return (
    <Link href={href} className="group inline-flex items-center" aria-label="RENTR Home">
      {content}
    </Link>
  );
};

export default Logo;
