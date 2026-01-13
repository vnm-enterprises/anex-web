export default function HeroSection() {
  return (
    <section className="relative flex min-h-[650px] flex-col justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvcsQxZBIRRuTeL02NHKl0FHfV1gOdjwzX1IrQLYBh24u8K_9pVGrEqBYvZ6a4RZMhzrI8H17MYeO4iW5p9caqZve28cQNQblGNe2stvCPQiy7YHlhB4SE0YXAM7JYclOvbvOW_ve9vKpI_xd9BwWtGJwMAaeDMzLglr0VL4cFnIkVg0BRsn3Qc0HswR3__4bx6KBfukFmT9tfkr-Gz-7fVtQYgIo15klKmZnqODBSnmewn8u9eRJB5wPOz2PrqsuTIbuerWw8lWU"
          alt="Modern apartment interior"
          className="h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

        {/* TODO bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80" />
        <div className="absolute bottom-0 left"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-black shadow">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          No. 1 Rental Platform in Sri Lanka
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          Find your perfect home
          <br />
          <span className="text-primary">without the hassle.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
          Discover verified annexes, rooms, and houses for rent across Sri Lanka
          directly from owners.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg sm:flex-row">
          <div className="flex flex-1 items-center gap-2 px-4 py-3">
            <span className="text-gray-400">📍</span>
            <input
              type="text"
              placeholder="Enter City (e.g., Colombo)"
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>

          <div className="hidden sm:block w-px bg-gray-200" />

          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-gray-400">🏠</span>
            <select className="bg-transparent text-sm outline-none">
              <option>Any Type</option>
              <option>Annex</option>
              <option>Room</option>
              <option>House</option>
            </select>
          </div>

          <div className="hidden sm:block w-px bg-gray-200" />

          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-gray-400">💰</span>
            <select className="bg-transparent text-sm outline-none">
              <option>Max Budget (LKR)</option>
              <option>50,000</option>
              <option>75,000</option>
              <option>100,000+</option>
            </select>
          </div>

          <button className="m-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-black hover:bg-primary-dark transition">
            Search
          </button>
        </div>

        <p className="mt-4 text-xs text-white/60">
          Popular: Nugegoda · Maharagama · Dehiwala · Battaramulla
        </p>
      </div>
    </section>
  );
}
