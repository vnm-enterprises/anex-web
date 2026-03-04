import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "Annex.lk - Find Your Perfect Rental in Sri Lanka",
    template: "%s | Annex.lk",
  },
  description:
    "Sri Lanka's premier rental marketplace. Find annexes, boarding places, apartments, and houses for long-term rent across all 25 districts.",
  keywords: [
    "Sri Lanka rentals",
    "annex for rent",
    "boarding place",
    "apartment rent Colombo",
    "house rent Sri Lanka",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://annex.lk",
    siteName: "Annex.lk",
    title: "Annex.lk - Find Your Perfect Rental in Sri Lanka",
    description:
      "Sri Lanka's premier rental marketplace for annexes, boarding places, apartments, and houses.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f9b72",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
