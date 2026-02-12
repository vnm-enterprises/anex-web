import { Bed, Bath, Ruler } from "lucide-react";

interface PropertyDetailsProps {
  beds: number;
  baths: number;
  area: number;
  description: string;
}

export default function PropertyDetails({
  beds,
  baths,
  area,
  description,
}: PropertyDetailsProps) {
  return (
    <>
      {/* Key Features */}
      <div className="flex items-center gap-8 py-4 border-b border-gray-100 dark:border-gray-800 mb-8 overflow-x-auto">
        <Feature icon={<Bed />} label="Bedroom" value={`${beds}`} />
        <Feature icon={<Bath />} label="Bathroom" value={`${baths}`} />
        <Feature icon={<Ruler />} label="Area" value={`${area} sqft`} />
      </div>

      {/* Description */}
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4">About this place</h3>
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>{description}</p>
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
    <div className="flex items-center gap-3 min-w-max border px-4 py-1 rounded-md justify-between">
      <div className="p-2 rounded-md bg-[#f8fcfa]  text-gray-700">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}