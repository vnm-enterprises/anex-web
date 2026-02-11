// components/single-items/PropertyHeader.tsx
import { ShieldCheck } from "lucide-react";

interface PropertyHeaderProps {
  title: string;
  location: string;
  isActive: boolean;
  isVerified: boolean;
}

export default function PropertyHeader({
  title,
  location,
  isActive,
  isVerified,
}: PropertyHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        {isVerified && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            <ShieldCheck size={14} />
            Verified
          </span>
        )}
      </div>

      <p className="text-gray-500 dark:text-gray-400">{location}</p>

      <p
        className={`mt-2 text-sm font-medium ${
          isActive ? "text-emerald-600" : "text-red-500"
        }`}
      >
        ● {isActive ? "Available now" : "Currently unavailable"}
      </p>
    </div>
  );
}
