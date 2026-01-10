import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Amenities from "@/components/single-items/Amenities";
import Gallery from "@/components/single-items/Gallery";
import LocationMap from "@/components/single-items/LocationMap";
import OwnerCard from "@/components/single-items/OwnerCard";
import PricingCard from "@/components/single-items/PricingCard";
import PropertyDetails from "@/components/single-items/PropertyDetails";
import PropertyHeader from "@/components/single-items/PropertyHeader";
import Reviews from "@/components/single-items/Reviews";
import { SimilarProperties } from "@/components/single-items/SimilarProperties";

export default function ListingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background-light dark:bg-background-dark pt-10">
        <Gallery />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">
            {/* LEFT */}
            <div className="flex-1">
              <PropertyHeader />
              <PropertyDetails />
              <Amenities />
              <LocationMap />
              <Reviews />
            </div>

            {/* RIGHT */}
            <div className="lg:w-[380px] flex-shrink-0 space-y-6">
              <PricingCard />
              <OwnerCard />
            </div>
          </div>
          <SimilarProperties />
        </div>

      </main>
      <Footer />
    </>
  );
}
