import { BadgeCheck, Key, MapPin } from "lucide-react";

export default function PropertyHeader() {
  return (
    <section className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge label="Verified Listing" icon={<BadgeCheck size={14} />} />
        <Badge label="Available Now" icon={<Key size={14} />} variant="blue" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Modern Upstairs Annex with Private Entrance
      </h1>

      <p className="text-gray-500 flex items-center gap-1">
        <MapPin size={16} /> High Level Road, Nugegoda
      </p>
    </section>
  );
}

function Badge({
  label,
  icon,
  variant = "green",
}: {
  label: string;
  icon: React.ReactNode;
  variant?: "green" | "blue";
}) {
  const styles =
    variant === "blue"
      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
      : "bg-primary/10 text-emerald-700 dark:text-primary";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles}`}
    >
      {icon}
      {label}
    </span>
  );
}
