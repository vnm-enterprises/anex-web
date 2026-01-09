import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import FeaturedListings from "@/components/landing/featured-listing";
import HeroSection from "@/components/landing/hero";
import ListPropertyCTA from "@/components/landing/ListPropertyCTA";
import PopularLocations from "@/components/landing/PopularLocations";
import WhyAnex from "@/components/landing/WhyAnex";


export default function Home() {
  return (
     <>
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <FeaturedListings />
        <PopularLocations />
        <WhyAnex />
        <ListPropertyCTA />
      </main>
      <Footer />
    </>
  );
}
