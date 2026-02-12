import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import Link from "next/link";



export default function SimilarPropertyCard({
  id,
  title,
  location,
  price,
  image,
  beds,
  baths,
  area,
}: {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  area: number;
}) {

  const slug = `${id}`;

  return (
    <div className="group bg-s[#ffffff] rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image || "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full bg-[#f1f1f1]">
        <h4 className="font-bold text-gray-900  leading-tight mb-1 line-clamp-2">
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
            <Ruler size={16} /> {area.toLocaleString()} sqft
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-gray-600  border-t border-b border-gray-100  py-3 mb-3">
          <p className="text-primary-content font-bold text-lg">
            Rs. {price.toLocaleString()}
          </p>

          <Link href={`/rentals/${slug}`} className="block bg-primary rounded-lg ">
            <button className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary-content rounded-lg cursor-pointer hover:bg-primary hover:text-primary-content transition">
              View
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}