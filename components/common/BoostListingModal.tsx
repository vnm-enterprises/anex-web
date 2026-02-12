"use client";

import { useState } from "react";
import api from "@/lib/api";

type Tier = "BOOSTED" | "FEATURED";

export default function BoostListingModal({ propertyId }: { propertyId: string }) {
  const [tier, setTier] = useState<Tier>("BOOSTED");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const handlePayHere = async () => {
    // try {
    //   setLoading(true);

    //   const res = await api.post("/payments/boost", {
    //     propertyId,
    //     tier,
    //     durationDays: days,
    //   });

    //   submitToPayHere(res.data.payhere);
    // } catch (err) {
    //   alert("Payment initialization failed");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <h3 className="font-bold text-lg">Boost this listing</h3>

      {/* Tier */}
      <select
        value={tier}
        onChange={(e) => setTier(e.target.value as Tier)}
        className="w-full rounded-lg border p-2"
      >
        <option value="BOOSTED">Boosted (Top results)</option>
        <option value="FEATURED">Featured (Homepage)</option>
      </select>

      {/* Duration */}
      <select
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="w-full rounded-lg border p-2"
      >
        <option value={7}>7 Days</option>
        <option value={14}>14 Days</option>
        <option value={30}>30 Days</option>
      </select>

      <button
        disabled={loading}
        onClick={handlePayHere}
        className="w-full rounded-lg bg-primary py-2 font-bold"
      >
        {loading ? "Redirecting…" : "Pay & Boost"}
      </button>
    </div>
  );
}
