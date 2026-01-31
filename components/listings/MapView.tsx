"use client";

import { Property } from "@/types/Property";

export default function MapView({ listings }: { listings: Property[] }) {
  const valid = listings.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  if (valid.length === 0)
    return <p className="text-center">No map data available.</p>;

  return (
    <iframe
      className="w-full h-[520px] rounded-xl"
      src={`https://maps.google.com/maps?q=${valid[0].latitude},${valid[0].longitude}&z=13&output=embed`}
    />
  );
}
