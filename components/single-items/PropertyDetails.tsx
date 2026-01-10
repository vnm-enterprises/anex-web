import { Bed, Bath, Ruler } from "lucide-react";

export default function PropertyDetails() {
  return (
    <>
      {/* Key Features */}
      <div className="flex items-center gap-8 py-4 border-b border-gray-100 dark:border-gray-800 mb-8 overflow-x-auto">
        <Feature icon={<Bed />} label="Bedroom" value="1" />
        <Feature icon={<Bath />} label="Bathroom" value="1" />
        <Feature icon={<Ruler />} label="Area" value="650 sqft" />
      </div>

      {/* Description */}
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4">About this place</h3>
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            Discover this newly built, spacious upstairs anex located in a highly
            residential and safe neighborhood in Nugegoda. Just 200m from High
            Level Road.
          </p>
          <p>
            The unit features a large bedroom with a balcony, a modern bathroom
            with hot water, and a cozy pantry area. Ideal for professionals or
            couples.
          </p>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 min-w-max">
      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
