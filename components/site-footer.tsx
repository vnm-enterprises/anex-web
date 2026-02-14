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
    <footer className="bg-white dark:bg-background border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Home className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Annex<span className="text-primary">.lk</span>
              </span>
            </Link>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Sri Lanka's #1 marketplace for long-term rentals.
              Connecting tenants with verified owners for a seamless rental experience.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/search?district=colombo" className="hover:text-primary transition-colors">Colombo Rentals</Link></li>
              <li><Link href="/search?district=kandy" className="hover:text-primary transition-colors">Kandy Rentals</Link></li>
              <li><Link href="/search?district=galle" className="hover:text-primary transition-colors">Galle Rentals</Link></li>
              <li><Link href="/search?type=apartment" className="hover:text-primary transition-colors">Apartments for Rent</Link></li>
              <li><Link href="/search?type=house" className="hover:text-primary transition-colors">Houses for Rent</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get the latest listings delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Annex.lk. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/sitemap" className="hover:text-primary flex items-center gap-1">
              Sitemap <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
