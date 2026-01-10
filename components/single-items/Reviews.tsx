import { Star } from "lucide-react";

export default function Reviews() {
  return (
    <section className="pt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Star className="text-yellow-500 fill-yellow-500" />
        <h3 className="text-xl font-bold">
          4.8 <span className="text-gray-500 font-normal">(12 reviews)</span>
        </h3>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border rounded-xl p-6">
        <p className="font-semibold mb-1">Sahan D.</p>
        <p className="text-sm text-gray-500 mb-3">October 2023</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          “Great place! The owner is very helpful. Perfect location for working
          professionals.”
        </p>
      </div>

      <button className="mt-6 text-primary font-medium text-sm hover:underline">
        Read all 12 reviews
      </button>
    </section>
  );
}
