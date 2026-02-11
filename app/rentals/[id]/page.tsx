// app/rentals/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ClientWrapper from "./ClientWrapper";

/* -------------------------------------------------------------------------- */
/*                              DATA FETCHING                                 */
/* -------------------------------------------------------------------------- */

async function getSingleProperty(id: string) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;

  const property = await getSingleProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | Anex Rentals",
      description: "The requested rental property could not be found.",
    };
  }

  const image =
    Array.isArray(property.propertyImages) && property.propertyImages.length > 0
      ? property.propertyImages[0]
      : "/placeholder.jpg";

  return {
    title: `${property.title} – Rs. ${property.price} | Anex`,
    description: property.description?.slice(0, 160),
    openGraph: {
      images: [{ url: image }],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default async function RentalPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const property = await getSingleProperty(id);

  if (!property || !property.isActive) {
    notFound();
  }

  return (
    <>
      <div className=" w-full">
        <Navbar />
      </div>
      <main className="bg-background-light pt-10">
        <ClientWrapper property={property} />
      </main>
      <Footer />
    </>
  );
}
