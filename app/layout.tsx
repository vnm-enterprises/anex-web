import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthHydrator from "@/components/common/AuthHydrator";
import GoogleProviders from "@/providers/google-providers";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import ScrollToTopButton from "@/components/common/AccessNavBar";


const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "annex.lk – Find your perfect home",
    template: "%s | annex.lk",
  },
  description:
    "Find annexes, rooms, houses and short stays for rent across Sri Lanka. Search by city, town or property ID on annex.lk.",

  applicationName: "annex.lk",

  keywords: [
    "annex.lk",
    "annex for rent Sri Lanka",
    "rooms for rent Sri Lanka",
    "houses for rent Sri Lanka",
    "short stays Sri Lanka",
    "boarding places Sri Lanka",
    "rent annex",
    "property rental Sri Lanka",
  ],

  authors: [{ name: "annex.lk" }],
  creator: "annex.lk",
  publisher: "annex.lk",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://annex.lk",
  },

  openGraph: {
    type: "website",
    url: "https://annex.lk",
    title: "annex.lk – Find your perfect home",
    description:
      "Find annexes, rooms and houses for rent across Sri Lanka. Simple, fast and trusted.",
    siteName: "annex.lk",
    images: [
      {
        url: "https://annex.lk/og-image.png",
        width: 1200,
        height: 630,
        alt: "annex.lk – Property rentals in Sri Lanka",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "annex.lk – Find your perfect home",
    description: "Find annexes, rooms and houses for rent across Sri Lanka.",
    images: ["https://annex.lk/og-image.png"],
  },

  category: "real estate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} bg-[#f8fcfa] text-[#0d1b14] bg-background-light dark:bg-background-dark font-display text-text-main antialiased selection:bg-primary selection:text-black`}
      >
        <AuthHydrator />
        <GoogleProviders> {children}
            <ScrollToTopButton />
           </GoogleProviders>
      </body>
    </html>
  );
}
