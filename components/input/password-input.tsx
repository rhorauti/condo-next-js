import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isInvalid = props['aria-invalid'];

  const toogleVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex">
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <span
        onClick={toogleVisibility}
        className={cn(
          `absolute right-2 top-2.5 cursor-pointer select-none`,
          isInvalid ? 'text-destructive' : 'text-muted-foreground'
        )}
      >
        {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
      </span>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
