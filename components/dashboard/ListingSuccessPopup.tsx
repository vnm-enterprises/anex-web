"use client";

import { CheckCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ListingSuccessPopupProps {
  listingId?: string;
}

export default function ListingSuccessPopup({ listingId }: ListingSuccessPopupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Detect popup trigger ONCE when component mounts/matches
  useEffect(() => {
    const shouldShowPopup = searchParams.get("listing") === "created";
    const setOpenState = async () => {
      await setIsOpen(true)
    }

    if (shouldShowPopup && !isOpen) {
      setOpenState()

      // Clean up URL after a short delay to ensure popup renders
      const timer = setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Listing Published!
          </h3>
          <button
            onClick={() => {
                setIsOpen(false)
                router.push("/dashboard")
              }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="text-green-500" size={24} />
          <p className="text-green-700 dark:text-green-300">
            Your property listing has been successfully published!
          </p>
        </div>

        <div className="space-y-4">


          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push("/dashboard")
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}