import { ReadonlyURLSearchParams } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs({
  params,
}: {
  params: ReadonlyURLSearchParams;
}) {
  const city = params.get("query") || params.get("location");

  return (
    <div className="mb-6 flex gap-2 text-sm">
      <Link href="/">Home</Link>
      <span>/</span>
      <Link href="/rentals">Rentals</Link>
      <span>/</span>
      <span className="font-semibold">
        {city ? `Search: ${city}` : "All Listings"}
      </span>
    </div>
  );
}
