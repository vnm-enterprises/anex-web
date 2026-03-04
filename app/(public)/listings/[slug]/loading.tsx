import { Skeleton } from "@/components/ui/skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-2xl" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-32 rounded-2xl shrink-0" />
            ))}
          </div>
          <div className="space-y-4 pt-8">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-48 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
