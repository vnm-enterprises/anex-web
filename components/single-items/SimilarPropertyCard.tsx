import { Bath, Bed, MapPin, Ruler } from "lucide-react";

export default function SimilarPropertyCard({
  title,
  location,
  price,
  image,
  beds,
  baths,
  area,
}: {
  title: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  area: string;
}) {
  return (
    <div className="group bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute top-3 left-3 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">
          NEW
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">
          {title}
        </h4>

        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
          <MapPin size={14} />
          {location}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 border-t border-b border-gray-100 dark:border-gray-800 py-3 mb-3">
          <span className="flex items-center gap-1">
            <Bed size={16} /> {beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} /> {baths}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={16} /> {area}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-primary font-bold text-lg">{price}</p>

          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
