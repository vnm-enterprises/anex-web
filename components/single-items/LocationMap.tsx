import { Map } from "lucide-react";

export default function LocationMap() {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4">Location</h3>

      <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgPd7SRqiJi0xg60gP1bRWMA4mji97Z-kPii4JHQ1w61chz0KY9HeqbT1VVH4ufH38xQRJGuUjxgt0v3YFxptx3vaQzbJtP1d6fXp9YpULtmM1EQbFosFrA41aL6U-iS8kw7EPxhk4GkHA6nKqn8Md4ja4mdFvCuZjEni1yAyVu3mrDhftrFARLH48BasGm8-ZDfICmy_ifV_22oZfQVZJ7S3gvtEcm-vcm3R7sDPxnJxkiSsHM042HmkHKQyM8jXBho6wATokQYU"
          className="w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white dark:bg-gray-900 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition">
            <Map className="text-primary" size={18} />
            View on Google Maps
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Nugegoda, Western Province, Sri Lanka
      </p>
    </section>
  );
}
