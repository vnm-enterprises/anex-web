import { Phone, MessageCircle, Calendar } from "lucide-react";

export default function PricingCard() {
  return (
    <div className="sticky top-24 bg-background dark:bg-surface-dark rounded-2xl border p-6 z-30">
      <div className="mb-6">
        <p className="text-3xl font-bold">Rs. 35,000</p>
        <p className="text-sm text-emerald-600 font-medium">
          ● Available immediately
        </p>
      </div>

      <div className="space-y-3">
        <ActionButton icon={<Phone />} label="Show Phone Number" primary />
        <ActionButton icon={<MessageCircle />} label="Chat on WhatsApp" />
        <ActionButton icon={<Calendar />} label="Schedule a Visit" muted />
      </div>

      <div className="mt-6 pt-6 border-t text-center text-xs text-gray-400">
        Safe & Secure Rental
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  primary,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  muted?: boolean;
}) {
  const base =
    "w-full flex items-center justify-center gap-2 py-3 rounded-xl transition";

  if (primary)
    return (
      <button className={`${base} bg-primary text-primary-content font-bold flex items-center`}>
        {icon}
        {label}
      </button>
    );

  if (muted)
    return (
      <button className={`${base} bg-gray-100 dark:bg-gray-700 flex items-center`}>
        {icon}
        {label}
      </button>
    );

  return (
    <button className={`${base} border-2 border-primary/30 flex items-center `} >
      {icon}
      {label}
    </button>
  );
}
