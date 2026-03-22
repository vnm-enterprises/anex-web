import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { AuthStoreProvider } from "@/components/auth/auth-store-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentr.lk"),
  title: {
    default: "RENTR - Find Your Perfect Rental in Sri Lanka",
    template: "%s | RENTR",
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
    url: "https://rentr.lk",
    siteName: "RENTR",
    title: "RENTR - Find Your Perfect Rental in Sri Lanka",
    description:
      "Sri Lanka's premier rental marketplace for annexes, boarding places, apartments, and houses.",
    images: [
      {
        url: "/media/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "RENTR rental marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RENTR - Find Your Perfect Rental in Sri Lanka",
    description:
      "Sri Lanka's premier rental marketplace for annexes, boarding places, apartments, and houses.",
    images: ["/media/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#EA580C",
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
        <AuthStoreProvider>{children}</AuthStoreProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
