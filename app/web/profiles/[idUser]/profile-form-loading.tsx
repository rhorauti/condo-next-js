import { Skeleton } from '@/components/ui/skeleton';

export function ProfileFormLoading() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 w-full p-2">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-700 rounded-md p-3">
        <Skeleton className="h-6 w-40 bg-white/20" />
        <Skeleton className="h-6 w-14 bg-white/20" />
      </div>

      {/* User section */}
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Inputs */}
        <div className="flex flex-col gap-4 grow">
          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-10 md:flex-1" />
            <Skeleton className="h-10 md:flex-[4]" />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-10 md:flex-1" />
            <Skeleton className="h-10 md:flex-[4]" />
            <Skeleton className="h-10 md:flex-[4]" />
          </div>
        </div>

        {/* Avatar */}
        <Skeleton className="h-32 w-32 rounded-full mx-auto shrink-0" />
      </div>

      {/* Address header */}
      <div className="flex justify-between bg-slate-700 rounded-md p-3">
        <Skeleton className="h-6 w-32 bg-white/20" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Address rows */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-2">
          <Skeleton className="h-10 md:w-20 w-full" />
          <Skeleton className="h-10 md:w-32 w-full" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 md:w-24 w-full" />
          <Skeleton className="h-10 md:w-24 w-full" />

          <div className="flex flex-col md:flex-row gap-2 items-end">
            <Skeleton className="h-10 md:w-10 w-full rounded-md" />
            <Skeleton className="h-10 md:w-10 w-full rounded-md" />
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex justify-between items-center bg-slate-700 rounded-md p-3">
        <Skeleton className="h-6 w-24 bg-white/20" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Skeleton className="h-10 w-full md:w-32" />
        <Skeleton className="h-10 w-full md:w-32" />
        <Skeleton className="h-10 w-full md:w-32" />
      </div>
    </div>
  );
}
