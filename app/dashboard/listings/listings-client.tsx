"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ArrowRight, Bolt, Loader2 } from "lucide-react";
import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { BoostModal } from "@/components/dashboard/boost-modal";
import { useRouter } from "next/navigation";

export function DashboardListingsClient({
  listings: initialListings,
}: {
  listings: any[];
}) {
  const [listings, setListings] = useState(initialListings);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const handleBoostClick = (id: string) => {
    setSelectedListingId(id);
    setIsBoostModalOpen(true);
  };

  const handlePaymentClick = async (id: string) => {
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: id,
          type: "ad_listing",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate checkout");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
          >
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-black tracking-tighter">My Listings</h1>
          <p className="text-muted-foreground font-medium">
            Manage and monitor all your property advertisements in one place.
          </p>
        </div>

        <Link
          href="/dashboard/listings/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Create New Ad
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-[3rem] border-dashed border-2 p-20 text-center bg-muted/20">
          <div className="h-24 w-24 rounded-[2.5rem] bg-muted flex items-center justify-center mx-auto text-muted-foreground/30 mb-8">
            <Plus size={48} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">
            No listings yet
          </h2>
          <p className="max-w-md mx-auto text-muted-foreground font-medium mb-10">
            You haven&apos;t created any listings yet. Start reaching thousands
            of potential tenants today.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-10 h-16 font-black text-lg"
          >
            <Link href="/dashboard/listings/new">
              Create Your First Listing
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {listings.map((listing) => (
            <div key={listing.id} className="relative group">
              <ListingCard listing={listing} />
              <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                <Link
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="flex items-center justify-center h-10 px-4 bg-white/95 backdrop-blur-md text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                >
                  Edit Details
                </Link>

                {listing.status === "approved" && !listing.is_boosted && (
                  <button
                    onClick={() => handleBoostClick(listing.id)}
                    className="flex items-center justify-center h-10 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap"
                  >
                    <Bolt className="h-3 w-3 mr-1.5 fill-current" />
                    Boost Ad
                  </button>
                )}

                {listing.payment_status === "unpaid" && (
                  <button
                    onClick={() => handlePaymentClick(listing.id)}
                    className="flex items-center justify-center h-10 px-4 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all whitespace-nowrap"
                  >
                    Complete Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListingId && (
        <BoostModal
          isOpen={isBoostModalOpen}
          onClose={() => setIsBoostModalOpen(false)}
          listingId={selectedListingId}
          onSuccess={() => {
            router.refresh(); // To fetch updated data
          }}
        />
      )}
    </div>
  );
}
