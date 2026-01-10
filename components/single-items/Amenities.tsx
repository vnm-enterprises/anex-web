import {
  Wifi,
  Snowflake,
  Bike,
  Flame,
  Video,
  BalloonIcon,
} from "lucide-react";

export default function Amenities() {
  const amenities = [
    { icon: <Wifi size={18} />, label: "Fiber Internet" },
    { icon: <Snowflake size={18} />, label: "Air Conditioning" },
    { icon: <Bike size={18} />, label: "Bike Parking" },
    { icon: <Flame size={18} />, label: "Hot Water" },
    { icon: <Video size={18} />, label: "CCTV Security" },
    { icon: <BalloonIcon size={18} />, label: "Private Balcony" },
  ];

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-6">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
        {amenities.map((a) => (
          <div key={a.label} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            {a.icon}
            <span>{a.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
