import { ArrowRight } from "lucide-react";

export default function OwnerCard() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border p-5 flex items-center gap-4">
      <div className="relative">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuClUlJe6x5X6dObtrlrM03v4pR0gt17JhO8LdVataNzP4WWqjyz7zqsExpy5Dc3EOikSdRA4dzqYN_nKAK7XY8ZFpCotiSis4aOCbp5j-cBsfb6rHCsO5IfKAC9QMJ0ZPEV_sbMrx3YceayscGbcu0sQ3xb-3tGqKleUo3R-al2ilkbP4_JhuERhun98stW-slYGzfXK6jrcgP4ev-zWV2_aVB1Nmf3G286XIlxJq8fJXaJbazxhPA7NGoqY-g1ncU1vUG7UERz25I"
          className="w-14 h-14 rounded-full object-cover"
        />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-white rounded-full" />
      </div>

      <div className="flex-1">
        <p className="text-xs uppercase text-gray-500 font-semibold">
          Listed by
        </p>
        <p className="font-bold">Kamal Perera</p>
        <p className="text-xs text-gray-400">Member since 2019</p>
      </div>

      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
