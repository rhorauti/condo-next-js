import { cn } from '@/lib/utils';
import Link from 'next/link';

export function PaginationLinkItem({
  href,
  isActive,
  ...props
}: React.ComponentProps<typeof Link> & { isActive?: boolean }) {
  return (
    <Link
      href={href || '#'}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-400 text-sm',
        isActive && 'bg-primary text-primary-foreground'
      )}
      {...props}
    />
  );
}
