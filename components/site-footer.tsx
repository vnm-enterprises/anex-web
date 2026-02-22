import Link from "next/link"
import {
  Home,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
} from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-muted border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-foreground">
                Annex<span className="text-primary italic">.lk</span>
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Sri Lanka's premier marketplace for long-term rentals. Connecting
              verified tenants with trusted landlords since 2024.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Follow us on ${social.label}`}
                  className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 soft-shadow"
                >
                  <social.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">
              Explore Locations
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {[
                { name: "Colombo Rentals", href: "/search?district=colombo" },
                { name: "Kandy Rentals", href: "/search?district=kandy" },
                { name: "Galle Rentals", href: "/search?district=galle" },
                { name: "Apartments", href: "/search?type=apartment" },
                { name: "Houses", href: "/search?type=house" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors flex items-center group"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {[
                "About Us",
                "Contact Support",
                "Terms of Service",
                "Privacy Policy",
                "Blog",
              ].map((name) => (
                <li key={name}>
                  <Link
                    href={`/${name.toLowerCase().replace(/ /g, "-")}`}
                    className="hover:text-primary transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-background p-6 rounded-2xl border border-border shadow-soft">
            <h4 className="font-bold text-foreground mb-2">Stay Updated</h4>
            <p className="text-xs text-muted-foreground mb-6">
              Get the latest listings delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-sm"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Annex.lk — Crafted in Sri Lanka
          </p>

          <div className="flex gap-8 text-[10px] items-center uppercase tracking-widest text-muted-foreground font-semibold">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              Sitemap <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
