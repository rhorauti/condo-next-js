import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';

export default function RequirementItem({
  isValid,
  label,
}: {
  isValid: boolean;
  label: string;
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-2 text-xs transition-colors duration-300',
        isValid ? 'text-green-600 dark:text-green-400' : 'text-destructive'
      )}
    >
      {isValid ? (
        <CircleCheck className="h-3 w-3 shrink-0" />
      ) : (
        <CircleX className="h-3 w-3 shrink-0 text-destructive" />
      )}
      <span>{label}</span>
    </li>
  );
}
