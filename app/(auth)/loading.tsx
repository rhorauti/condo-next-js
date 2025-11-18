import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    // Matches the width of your login/signup forms
    <Card className="w-[350px] mx-auto">
      <CardHeader className="gap-2 items-center">
        <Skeleton className="h-20 w-28" /> {/* Logo placeholder */}
        <Skeleton className="h-8 w-32" /> {/* Title placeholder */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-6" />
      </CardContent>
    </Card>
  );
}
