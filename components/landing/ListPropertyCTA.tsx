import Link from "next/link";

export default function ListPropertyCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-md bg-[#0d1b14] px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-24">
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Have a property to rent?
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
              Join thousands of landlords who trust annex.lk to find reliable
              tenants quickly and easily.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {/* Primary CTA */}
              <Link
                href="/list"
                className="flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-primary-dark"
              >
                List Your Property
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/how-it-works"
                className="flex h-12 items-center justify-center rounded-xl bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
