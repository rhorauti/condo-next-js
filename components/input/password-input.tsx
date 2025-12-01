import * as React from 'react';

import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '../ui/input';

/**
 * A password input component with a built-in visibility toggle.
 *
 * This component wraps a standard Input to allow users to switch between
 * masking their password (dots) and viewing it (text). It integrates automatically
 * with `aria-invalid` to style the toggle icon in error states.
 *
 * @remarks
 * **Note on the `type` prop:** This component controls the `type` attribute internally
 * (switching between 'password' and 'text'). Any `type` passed in `props` will be overridden.
 *
 * @param props - Standard HTML input attributes (e.g., value, onChange, placeholder).
 * @param ref - Forwarded ref to the underlying `HTMLInputElement`.
 *
 * @example
 * **Basic Usage:**
 * ```tsx
 * <PasswordInput
 * value={password}
 * onChange={(e) => setPassword(e.target.value)}
 * />
 * ```
 *
 * @example
 * **With Validation (React Hook Form example):**
 * ```tsx
 * <PasswordInput
 * {...register('password')}
 * aria-invalid={!!errors.password}
 * />
 * ```
 */
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
        placeholder="Digite sua senha"
        data-testid="password-input"
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type="button"
        data-testid="toggle-password-button"
        aria-label="Toggle password visibility"
        onClick={toogleVisibility}
        className={cn(
          `absolute right-2 top-2.5 cursor-pointer select-none`,
          isInvalid ? 'text-destructive' : 'text-muted-foreground'
        )}
      >
        {showPassword ? (
          <EyeIcon size={20} role="img" aria-label="show-password" />
        ) : (
          <EyeOffIcon size={20} role="img" aria-label="hide-password" />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
