"use client";

import { Phone, MessageCircle, Calendar, Lock } from "lucide-react";
import { useState } from "react";

interface PricingCardProps {
  price: number;
  isActive: boolean;
  keymoney?: number;
  landlordPhone?: string | null;
}

export default function PricingCard({
  price,
  isActive,
  keymoney,
  landlordPhone,
}: PricingCardProps) {
  const [showPhone, setShowPhone] = useState(false);

  const whatsappLink =
    landlordPhone
      ? `https://wa.me/${landlordPhone.replace(/\D/g, "")}`
      : null;

  return (
    <div className="sticky top-4 bg-white dark:bg-surface-dark rounded-md border border-gray-200 dark:border-gray-700 p-6 z-30">
      {/* Price */}
      <div className="mb-5">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          Rs. {price.toLocaleString()}
          <span className="text-sm font-normal text-gray-500"> / month</span>
        </p>

        {keymoney ? (
          <p className="text-sm text-gray-500 mt-1">
            Key money: {keymoney} months
          </p>
        ) : null}

        <p
          className={`mt-2 text-sm font-medium ${
            isActive
              ? "text-emerald-600"
              : "text-red-500"
          }`}
        >
          ● {isActive ? "Available now" : "Currently unavailable"}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* PHONE */}
        {landlordPhone ? (
          <button
            onClick={() => setShowPhone(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-black font-bold transition hover:opacity-90"
          >
            <Phone size={18} />
            {showPhone ? landlordPhone : "Show phone number"}
          </button>
        ) : (
          <DisabledButton label="Phone not available" />
        )}

        {/* WHATSAPP */}
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md border border-primary/30 hover:bg-primary/5 transition"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        ) : (
          <DisabledButton label="WhatsApp unavailable" />
        )}

        {/* VISIT (future)
        <DisabledButton label="Schedule visit (coming soon)" icon={<Calendar />} /> */}
      </div>

      {/* Trust note */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock size={12} />
        Contact details are protected
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function DisabledButton({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      disabled
      className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  );
}
