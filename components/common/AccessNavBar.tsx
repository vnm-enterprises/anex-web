"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Scroll-to-top button that appears on non-dashboard pages.
 *
 * - Only shows on non-dashboard routes
 * - Smoothly scrolls to top of page when clicked
 * - Fully accessible (keyboard + screen reader friendly)
 */
const ScrollToTopButton = () => {
  const pathname = usePathname();

  // Hide on dashboard pages
  if (pathname?.includes("/dashboard")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="bg-primary rounded-full p-2 border-none fixed bottom-4 right-4
                 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-primary cursor-pointer px-3 py-3"
    >
      <ArrowUp size={24} className="text-background-dark" />
    </button>
  );
};

export default ScrollToTopButton;