import {
  Bed,
  Bath,
  Wifi,
  Car,
  Heart,
  MapPin,
} from "lucide-react";

type Props = {
  title: string;
  location: string;
  price: string;
  image: string;
  badge?: string;
};

export default function PropertyCard({
  title,
  location,
  price,
  image,
  badge,
}: Props) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border-color bg-surface-light transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-surface-dark">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {badge && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-bold text-background-dark shadow-sm">
            {badge}
          </span>
        )}

        <button className="absolute right-3 top-3 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-md hover:bg-black/40">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold leading-tight text-text-main transition-colors group-hover:text-primary dark:text-white">
          {title}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
          <MapPin size={14} />
          {location}
        </p>

        {/* Features */}
        <div className="my-3 flex gap-4 border-y border-border-color py-3 text-sm dark:border-white/10">
          <span className="flex items-center gap-1">
            <Bed size={16} /> 1 Bed
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} /> 1 Bath
          </span>
          <span className="flex items-center gap-1">
            <Wifi size={16} /> WiFi
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">Monthly Rent</p>
            <p className="text-xl font-bold text-primary">{price}</p>
          </div>

          <button className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-background-dark">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
