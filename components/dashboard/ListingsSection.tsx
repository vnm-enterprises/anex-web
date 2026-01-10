"use client";

import { useViewMode } from "./useViewMode";
import ViewToggle from "./ViewToggle";
import ListingCard from "./ListingCard";
import { Landmark } from "lucide-react";

/* -------------------- */
/* Listing data model   */
/* -------------------- */
export type ListingStatus = "active" | "reviewing" | "occupied";

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  views: number;
  status: ListingStatus;
  image: string;
}

/* -------------------- */
/* Global listings data */
/* -------------------- */
const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "2 Bedroom Annex",
    location: "Nugegoda",
    price: 35000,
    description:
      "Spacious upstairs anex with separate entrance, fully tiled, parking available. Walking distance to High Level road.",
    views: 1240,
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
  {
    id: "2",
    title: "Single Room for Student",
    location: "Kandy",
    price: 12000,
    description:
      "Ideal for university students. Shared bathroom, cooking facility available. Close to Peradeniya University.",
    views: 450,
    status: "reviewing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
  {
    id: "3",
    title: "Luxury House",
    location: "Battaramulla",
    price: 150000,
    description:
      "Currently rented out until Dec 2024. 4 Bedrooms, 3 Bathrooms, Servant quarters, Solar power.",
    views: 2100,
    status: "occupied",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
];

export default function ListingsSection() {
  const { view, setView } = useViewMode();

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            <Landmark />
          </span>
          My Listings
        </h2>

        <ViewToggle view={view} setView={setView} />
      </div>

      {/* Listings */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} view={view} />
        ))}
      </div>
    </section>
  );
}
