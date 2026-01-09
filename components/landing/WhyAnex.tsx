import { Filter, Handshake, Verified } from "lucide-react";

export default function WhyAnex() {
  return (
    <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-primary">
            Why anex.lk?
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white sm:text-4xl">
            The smartest way to find a rental
          </h2>
        </div>

        {/* Features */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Verified Listings */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary-dark dark:bg-primary/10 dark:text-primary">
              <span className="material-symbols-outlined text-[32px]">
                <Verified />
              </span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main dark:text-white">
              Verified Listings
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We manually check listings to ensure they are real and accurate.
              Say goodbye to fake ads.
            </p>
          </div>

          {/* Direct Contact */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary-dark dark:bg-primary/10 dark:text-primary">
              <span className="material-symbols-outlined text-[32px]">
                <Handshake />
              </span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main dark:text-white">
              Direct Contact
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Connect directly with landlords. No hidden broker fees or
              middlemen involved.
            </p>
          </div>

          {/* Advanced Search */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary-dark dark:bg-primary/10 dark:text-primary">
              <span className="material-symbols-outlined text-[32px]">
                <Filter />
              </span>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main dark:text-white">
              Advanced Search
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Find exactly what you want by filtering price, location, property
              type, and amenities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
