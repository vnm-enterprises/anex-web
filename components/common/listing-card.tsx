interface Props {
  title: string;
  price: string;
  location: string;
  type: string;
}

export default function ListingCard({ title, price, location, type }: Props) {
  return (
    <div className="rounded-2xl bg-white shadow hover:-translate-y-1 transition">
      <div className="h-48 bg-gray-200 rounded-t-2xl" />

      <div className="p-5">
        <p className="text-[#13ec80] font-bold">{price}/mo</p>
        <h3 className="mt-1 font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{location}</p>

        <button className="mt-4 w-full rounded-lg bg-[#f8fcfa] py-2 font-semibold hover:bg-gray-200">
          View Details
        </button>
      </div>
    </div>
  );
}
