import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthHydrator from "@/components/common/AuthHydrator";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "anex.lk – Find your perfect home",
    template: "%s | anex.lk",
  },
  description:
    "Find anexes, rooms, houses and short stays for rent across Sri Lanka. Search by city, town or property ID on anex.lk.",

  applicationName: "anex.lk",

  keywords: [
    "anex.lk",
    "anex for rent Sri Lanka",
    "rooms for rent Sri Lanka",
    "houses for rent Sri Lanka",
    "short stays Sri Lanka",
    "boarding places Sri Lanka",
    "rent anex",
    "property rental Sri Lanka",
  ],

  authors: [{ name: "anex.lk" }],
  creator: "anex.lk",
  publisher: "anex.lk",

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
    canonical: "https://anex.lk",
  },

  openGraph: {
    type: "website",
    url: "https://anex.lk",
    title: "anex.lk – Find your perfect home",
    description:
      "Find anexes, rooms and houses for rent across Sri Lanka. Simple, fast and trusted.",
    siteName: "anex.lk",
    images: [
      {
        url: "https://anex.lk/og-image.png",
        width: 1200,
        height: 630,
        alt: "anex.lk – Property rentals in Sri Lanka",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "anex.lk – Find your perfect home",
    description:
      "Find anexes, rooms and houses for rent across Sri Lanka.",
    images: ["https://anex.lk/og-image.png"],
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
        {children}
      </body>
    </html>
  );
}
