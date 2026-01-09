import { ArrowBigRight, LocateIcon } from "lucide-react";
import Link from "next/link";

export default function FeaturedListings() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white sm:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-2 text-lg text-text-secondary dark:text-gray-400">
              Handpicked properties for you today.
            </p>
          </div>

          <Link
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            View All Listings
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a2c24]">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkci7WV76y4h2dG7EaHGZPVTj8kw3EPXvWo5DQh6_FRfjUu-HUz0SHKgXcSFPUWjaoTxRxZzcx_k0Ha70wlnEVfjqCBvghK_I9d1U9vxs1Bzu4xaGHvZwgDzzSlPyMAL221tG5Row0S0kJdkYHCJGIBgyi2C3EbNgKazb0qFqlSr4_bwoiGE071t4gtJLxRa5qmBxv1F6ejh7WeQ04RftTP3YaOEQncg05zKlQQ4cJx60pNelrB6lTK-690ajqqg0KphUnxcd2Q4U"
                alt="Luxury Annex in Nugegoda"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute left-3 top-3 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-text-main backdrop-blur-sm shadow-sm">
                  ANNEX
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-xs font-bold text-black backdrop-blur-sm shadow-sm">
                  <span className="material-symbols-outlined text-[14px] filled">
                    verified
                  </span>
                  VERIFIED
                </span>
              </div>

              <button className="absolute right-3 top-3 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  favorite
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xl font-bold text-primary">
                  Rs. 35,000
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined mr-1 text-[16px]">
                    bed
                  </span>
                  2 Beds
                </div>
              </div>

              <h3 className="mb-1 text-lg font-bold text-text-main dark:text-white line-clamp-1">
                Luxury Annex in Nugegoda
              </h3>

              <p className="mb-4 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  location <LocateIcon />
                </span>
                Nugegoda, Colombo
              </p>

              <div className="mt-auto border-t border-gray-100 pt-4 dark:border-white/10">
                <button className="w-full rounded-lg bg-background-light py-2 text-sm font-bold text-text-main hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a2c24]">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYyKluTgHskLjzYC_jpLmFkcTRmjyPjv-uAyeW2rdbB2gRkfw-a-KQwJ28P-A6DwmJCUnkSa_zoEyXXrDSAdcj-nDjiMF6iaHiteh1d0Dil-yN-AU3FGe0HH5lhCJxtOoQVtUeQolrlkVmHRA0vQ6IO2si3wIxkLQ3Qz5MoPxgyPDoP7ziNGr3j_M7CfWvw_dU2Wk1EG_Xt4vEJilCNTHe0xB9bWtg34rgtmwAWYivo9K9EC-6JLUIY713-uGXX_nnmoClfigzrCk"
                alt="Cozy Room near University"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute left-3 top-3 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-text-main backdrop-blur-sm shadow-sm">
                  ROOM
                </span>
              </div>

              <button className="absolute right-3 top-3 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  favorite
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xl font-bold text-primary">
                  Rs. 15,000
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined mr-1 text-[16px]">
                    bed
                  </span>
                  1 Bed
                </div>
              </div>

              <h3 className="mb-1 text-lg font-bold text-text-main dark:text-white line-clamp-1">
                Cozy Room near University
              </h3>

              <p className="mb-4 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  location <LocateIcon />
                </span>
                Maharagama, Colombo
              </p>

              <div className="mt-auto border-t border-gray-100 pt-4 dark:border-white/10">
                <button className="w-full rounded-lg bg-background-light py-2 text-sm font-bold text-text-main hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a2c24]">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC68PK8fodk5hiFTUsPkRNKDkvkKCT24a7hn0rvoYHcOJpYJh65XfACFd4E9nUrkvfFCtCbA-7UoBdufVIijTVAzAqJsjEMMLlUYFoNTG2k-Q7eF56y6TUiWZIgaYpjK00cPVzTkRTmydwTEFdupKjo4QUMf2uADa_2LatEwwaZKFCVoqTv2knPyCKzQCsrPXAp_FctdRtK3Knfm3PM6eE6pOPq8yV8lJRkwxls9qqxA9zn2d934iCQY5xttbmxcKi8tQ1cmVcKHmI"
                alt="Fully Furnished House"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute left-3 top-3 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-text-main backdrop-blur-sm shadow-sm">
                  HOUSE
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-xs font-bold text-black backdrop-blur-sm shadow-sm">
                  <span className="material-symbols-outlined text-[14px] filled">
                    verified
                  </span>
                  VERIFIED
                </span>
              </div>

              <button className="absolute right-3 top-3 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  favorite
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xl font-bold text-primary">
                  Rs. 65,000
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined mr-1 text-[16px]">
                    bed
                  </span>
                  3 Beds
                </div>
              </div>

              <h3 className="mb-1 text-lg font-bold text-text-main dark:text-white line-clamp-1">
                Fully Furnished House
              </h3>

              <p className="mb-4 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  location <LocateIcon />
                </span>
                Battaramulla, Colombo
              </p>

              <div className="mt-auto border-t border-gray-100 pt-4 dark:border-white/10">
                <button className="w-full rounded-lg bg-background-light py-2 text-sm font-bold text-text-main hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="#"
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-3 text-sm font-bold text-text-main shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            View All Listings
            <span className="material-symbols-outlined text-[18px]">
              <ArrowBigRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
