import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        autoComplete="off"
        type={type}
        className={cn(
          'flex w-full rounded-md border border-primary bg-background px-3 py-1.5 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-sm focus-visible:shadow-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-shadow shadow-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
