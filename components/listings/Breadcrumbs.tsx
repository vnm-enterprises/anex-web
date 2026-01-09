import Link from "next/link";

export default function Breadcrumbs() {
  return (
    <div className="mb-6 hidden flex-wrap gap-2 lg:flex">
      <Link href="#" className="text-sm font-medium text-text-secondary hover:text-primary">
        Home
      </Link>
      <span className="text-sm text-text-secondary">/</span>
      <Link href="#" className="text-sm font-medium text-text-secondary hover:text-primary">
        Rentals
      </Link>
      <span className="text-sm text-text-secondary">/</span>
      <span className="text-sm font-medium text-text-main dark:text-white">
        Search Results
      </span>
    </div>
  );
}
