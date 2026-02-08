import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';

/**
 * Renders a single requirement list item with visual validation feedback.
 *
 * This component displays a checkmark in green when `isValid` is true,
 * and an X in the destructive color when `isValid` is false.
 * It is designed to be used as a child of a `<ul>` list.
 *
 * @param props - The component props.
 * @param props.isValid - Determines the visual state. `true` renders success styles (green), `false` renders error styles (red/destructive).
 * @param props.label - The text content to display describing the specific requirement.
 * @returns A styled `<li>` element containing a status icon and text label.
 *
 * @example
 * ```tsx
 * <ul>
 * <RequirementItem isValid={true} label="At least 8 characters" />
 * <RequirementItem isValid={false} label="Contains a number" />
 * </ul>
 * ```
 */
export default function RequirementItem({
  isValid,
  label,
  className,
}: {
  /**
   * Toggles between the success (green) and failure (red) states.
   */
  isValid: boolean;
  /**
   * The requirement text to display.
   */
  label: string;
  className?: string;
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-2 text-xs transition-colors duration-300',
        isValid ? 'text-green-600 dark:text-green-400' : 'text-destructive',
        className
      )}
    >
      {isValid ? (
        <CircleCheck
          role="img"
          aria-label="success icon"
          className="h-3 w-3 shrink-0"
        />
      ) : (
        <CircleX
          role="img"
          aria-label="failure icon"
          className="h-3 w-3 shrink-0 text-destructive"
        />
      )}
      <span>{label}</span>
    </li>
  );
}
