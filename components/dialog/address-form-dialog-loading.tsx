'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function AddressFormDialogLoading() {
  return (
    <div>
      <div className="sm:max-w-[60rem] max-h-screen flex flex-col">
        {/* HEADER */}
        <Skeleton className="h-10 w-full rounded-md" />

        {/* BODY */}
        <div className="flex flex-col gap-4 overflow-y-auto py-2">
          {/* ROW 1 */}
          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-10 md:w-24 w-full" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 flex-1" />
          </div>

          {/* ROW 2 */}
          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-10 flex-[4]" />
            <Skeleton className="h-10 md:w-32 w-full" />
          </div>

          {/* ROW 3 */}
          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 md:w-24 w-full" />
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button variant="outline" disabled>
            <Skeleton className="h-4 md:w-20 w-full" />
          </Button>

          <Button disabled>
            <Skeleton className="h-4 md:w-24 w-full" />
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}
