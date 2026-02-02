import { Skeleton } from '@/components/ui/skeleton';

export default function PostPageLoading() {
  return (
    <div className="flex flex-col items-center gap-6 mb-6 overflow-auto px-4">
      {/* Top badge/button */}
      <Skeleton className="h-10 w-32 rounded-lg" />

      {/* Search + avatar row */}
      <div className="flex flex-col gap-4 items-center justify-center w-full xs:flex-row">
        <Skeleton className="h-12 w-full max-w-md rounded-lg" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>

      {/* Card */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-4 border border-gray-300 w-full max-w-3xl rounded-lg"
        >
          <div className="flex gap-3 w-full">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-20" />
              </div>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 w-full">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
