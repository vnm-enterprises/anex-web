"use client";

import {
  Wifi,
  Snowflake,
  Bike,
  Flame,
  Video,
  Coffee,
  ParkingCircle,
  Tv,
  WashingMachine,
  Trash2,
  CheckCircle,
} from "lucide-react";

interface Amenity {
  id: string;
  name: string;
}

interface AmenitiesProps {
  amenities: Amenity[];
}


const amenityUIMap: Record<string, { icon: React.ReactNode; label?: string }> =
  {
    wifi: { icon: <Wifi size={16} />, label: "Wi-Fi" },
    ac: { icon: <Snowflake size={16} />, label: "Air Conditioning" },
    bike_parking: { icon: <Bike size={16} />, label: "Bike Parking" },
    hot_water: { icon: <Flame size={16} />, label: "Hot Water" },
    cctv: { icon: <Video size={16} />, label: "CCTV Security" },
    coffee: { icon: <Coffee size={16} />, label: "Coffee Maker" },
    parking: { icon: <ParkingCircle size={16} />, label: "Car Parking" },
    tv: { icon: <Tv size={16} />, label: "Smart TV" },
    washing_machine: {
      icon: <WashingMachine size={16} />,
      label: "Washing Machine",
    },
    bins: { icon: <Trash2 size={16} />, label: "Waste Disposal" },
  };



export default function Amenities({ amenities }: AmenitiesProps) {
  if (!amenities || amenities.length === 0) return null;
  console.log(amenities);

  return (
    <section className="mb-12">
      <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white">
        Amenities
      </h3>

      <div className="flex flex-wrap gap-3">
        {amenities.slice(0, 12).map((amenity) => {
          const ui = amenityUIMap[amenity.name];

          return (
            <div
              key={amenity.id}
              className="
                inline-flex items-center gap-2
                px-3 py-2
                rounded-md
                bg-gray-50
                text-gray-700
                text-sm font-medium
                border border-gray-200 dark:border-gray-700
              "
            >
              <span className="text-primary font-bold">
                {ui?.icon ?? <CheckCircle size={16} />}
              </span>

              <span className="whitespace-nowrap">
                {ui?.label ?? amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
