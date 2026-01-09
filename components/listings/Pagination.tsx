import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center gap-2">
        <button className="rounded-lg border border-border-color p-2 text-text-secondary hover:bg-surface-light dark:border-white/10 dark:hover:bg-surface-dark">
          <ChevronLeft size={18} />
        </button>

        <button className="h-10 w-10 rounded-lg bg-primary font-bold text-background-dark">
          1
        </button>

        {[2, 3].map((n) => (
          <button
            key={n}
            className="h-10 w-10 rounded-lg border border-border-color font-medium text-text-main hover:bg-surface-light dark:border-white/10 dark:text-white dark:hover:bg-surface-dark"
          >
            {n}
          </button>
        ))}

        <span className="text-text-secondary">...</span>

        <button className="h-10 w-10 rounded-lg border border-border-color font-medium dark:border-white/10">
          8
        </button>

        <button className="rounded-lg border border-border-color p-2 text-text-secondary hover:bg-surface-light dark:border-white/10 dark:hover:bg-surface-dark">
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}
