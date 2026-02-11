"use client";

import { Search, MapPin, Home, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxBudget, setMaxBudget] = useState(100000);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (maxBudget) params.set("maxBudget", String(maxBudget));

    router.push(`/rentals?${params.toString()}`);
  };

  return (
    <section className=" flex min-h-[100vh] items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background */}
      <div className="absolute inset-0 z-0 max-h-[100vh]">
        <img
          src="/media/living-room-luxury.png"
          alt="Modern apartment interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-[#f8fafc]/90 px-4 py-1.5 text-xs font-semibold text-black shadow">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          No. 1 Rental Platform in Sri Lanka
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold leading-tight text-[#f8fafc] sm:text-5xl md:text-6xl">
          Find your perfect home
          <br />
          <span className="text-primary">without the hassle.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#f8fafc]/85 sm:text-base">
          Discover verified annexes, rooms, and houses for rent across Sri Lanka
          directly from owners.
        </p>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="
            mx-auto mt-10 w-full max-w-4xl
            rounded-md bg-[#f8fafc] shadow-xl
            flex flex-col overflow-hidden
            sm:flex-row sm:rounded-md
          "
        >
          {/* City */}
          <div className="flex flex-1 items-center gap-2 px-4 py-3">
            <MapPin size={18} className="text-gray-400 shrink-0" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City, area or keyword"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="hidden sm:block w-px bg-gray-200" />

          {/* Type */}
          <div className="flex items-center gap-2 px-4 py-3">
            <Home size={18} className="text-gray-400 shrink-0" />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent text-sm outline-none cursor-pointer"
            >
              <option value="">Any Type</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="ANNEX">Annex</option>
              <option value="BOARDING">Boarding</option>
            </select>
          </div>

          <div className="hidden sm:block w-px bg-gray-200" />

          {/* Budget Slider */}
          <div className="flex flex-col justify-center gap-1 px-4 py-2 sm:min-w-[200px]">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                Up to LKR {maxBudget.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="
              m-2 flex items-center justify-center gap-2
              rounded-xl bg-primary px-4 py-4
              text-sm font-bold text-black
              hover:bg-primary-dark transition
              sm:rounded-md sm:px-5
            "
          >
            <Search size={18} />
            <span className="sm:hidden">Search</span>
          </button>
        </form>

        {/* Popular */}
        <p className="mt-4 text-xs text-[#f8fafc]/80">
          Popular: Nugegoda · Maharagama · Dehiwala · Battaramulla
        </p>
      </div>
    </section>
  );
}
