import { Home, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[#e7f3ed] bg-[#10b98107] pt-16 pb-8 dark:border-white/10 dark:bg-background-dark"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="mb-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="annex.lk home"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-background-dark">
                <Home size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">
                annex.lk
              </span>
            </Link>

            <p className="mx-auto sm:mx-0 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Sri Lanka&apos;s #1 platform for finding rental annexes, rooms,
              and houses. Simple, fast, and reliable.
            </p>
          </div>

          {/* Company */}
          <nav aria-label="Company" className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { id: 1, label: "About Us", route: "/about" },
                { id: 2, label: "Careers", route: "/careers" },
                { id: 3, label: "Contact", route: "/contact" },
                { id: 4, label: "Privacy Policy", route: "/privacy-policy" },
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.route}
                    className="text-sm text-gray-500 transition-colors hover:text-primary focus-visible:text-primary dark:text-gray-400 focus:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Discover */}
          <nav aria-label="Discover" className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Discover
            </h3>
            <ul className="space-y-3">
              {[
                { id: 1, label: "Find a Place", route: "/rentals" },
                { id: 2, label: "List Property", route: "/auth/signup" },
                { id: 3, label: "Popular Cities", route: "/rentals" },
                { id: 4, label: "Blog", route: "/blog" },
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.route}
                    className="text-sm text-gray-500 transition-colors hover:text-primary focus-visible:text-primary dark:text-gray-400 focus:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main dark:text-white">
              Connect
            </h3>

            <div className="flex justify-center sm:justify-start gap-4">
              <SocialIcon label="Facebook">
                <Facebook size={18} />
              </SocialIcon>

              <SocialIcon label="Twitter">
                <Twitter size={18} />
              </SocialIcon>

              <SocialIcon label="Instagram">
                <Instagram size={18} />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-8 text-center dark:border-white/10">
          <p className="text-sm text-gray-400">
            © {year} annex.lk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- */
/* Social Icon (Lucide)               */
/* ---------------------------------- */

function SocialIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-primary hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-white/5 dark:text-gray-400"
    >
      {children}
    </Link>
  );
}
