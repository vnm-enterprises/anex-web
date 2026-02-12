"use client";

import { ArrowRight } from "lucide-react";

interface OwnerCardProps {
  ownerName: string;
  ownerAvatar?: string;
  ownerJoinedAt: string | Date;
}

export default function OwnerCard({
  ownerName,
  ownerAvatar,
  ownerJoinedAt,
}: OwnerCardProps) {
  const joinedDate = new Date(ownerJoinedAt);
  const joinedYear = joinedDate.getFullYear();

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-md border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={ownerAvatar || "/avatar-placeholder.jpg"}
          alt={ownerName}
          className="w-14 h-14 rounded-full object-cover"
        />
        {/* Active dot */}
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase text-gray-500 font-semibold">
          Listed by
        </p>
        <p className="font-bold text-gray-900 dark:text-white truncate">
          {ownerName}
        </p>
        <p className="text-xs text-gray-400">
          Member since {joinedYear}
        </p>
      </div>

      {/* CTA */}
      <button
        aria-label="View owner profile"
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
