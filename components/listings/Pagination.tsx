// components/listings/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  }).filter((p) => p > 0 && p <= totalPages);

  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-border-color p-2 text-text-secondary hover:bg-surface-light disabled:opacity-40 dark:border-white/10 dark:hover:bg-surface-dark"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-10 w-10 rounded-lg font-medium ${
              page === currentPage
                ? "bg-primary text-background-dark"
                : "border border-border-color text-text-main hover:bg-surface-light dark:border-white/10 dark:text-white dark:hover:bg-surface-dark"
            }`}
          >
            {page}
          </button>
        ))}

        {totalPages > 5 && !pages.includes(totalPages) && (
          <>
            <span className="text-text-secondary">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="h-10 w-10 rounded-lg border border-border-color font-medium text-text-main hover:bg-surface-light dark:border-white/10 dark:text-white dark:hover:bg-surface-dark"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border border-border-color p-2 text-text-secondary hover:bg-surface-light disabled:opacity-40 dark:border-white/10 dark:hover:bg-surface-dark"
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}