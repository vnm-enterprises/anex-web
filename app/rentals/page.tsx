"use client";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import PropertyGrid from "@/components/listings/PropertyGrid";
import Pagination from "@/components/listings/Pagination";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Breadcrumbs from "@/components/listings/Breadcrumbs";
import { ListingView } from "@/types/view";
import { useState } from "react";
import ListingToolbar from "@/components/listings/ListingsToolbar";
import PropertyList from "@/components/listings/PropertyList";
import MapView from "@/components/listings/MapView";
import AdsCarousel from "@/components/listings/AdsCarousel";

export default function RentalsPage() {
  const [view, setView] = useState<ListingView>("grid");
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full">
        <aside className="w-full lg:w-1/4  shrink-0 max-w-7xl mx-auto px-4 md:px-10 py-6 flex flex-col lg:flex-row gap-8">
          <FiltersSidebar />
        </aside>
        <div className="flex-1">
          <Breadcrumbs />
          <AdsCarousel />
          <ListingToolbar view={view} onViewChange={setView} />
          {view === "grid" && <PropertyGrid />}
          {view === "list" && <PropertyList />}
          {view === "map" && <MapView />}
          <Pagination />
        </div>
      </main>
      <Footer />
    </>
  );
}
