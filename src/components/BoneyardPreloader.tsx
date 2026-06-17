import { Skeleton } from "@/components/ui/skeleton";

export function BoneyardPreloader() {
  return (
    <div className="container mx-auto px-4 py-24 space-y-12">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6">
        <Skeleton className="h-12 w-[300px] md:w-[500px]" />
        <Skeleton className="h-6 w-[250px] md:w-[400px]" />
        <Skeleton className="h-10 w-[150px] rounded-full" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
