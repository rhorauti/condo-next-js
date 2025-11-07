'use client';

export interface ButtonProps {
  btnClass?: string;
  labelClass: string;
  label: string;
  isDisabled: boolean;
  ariaLabel?: string;
  id?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: () => void;
}

export default function TextButton({
  btnClass,
  label,
  isDisabled = false,
  ariaLabel,
  id,
  tabIndex,
  onClick,
  onKeyDown,
}: ButtonProps) {
  return (
    <button
      className={`${btnClass} flex rounded-md justify-center items-center gap-1 font-semibold w-full px-4 py-2 disabled:bg-gray-400`}
      disabled={isDisabled}
      aria-label={ariaLabel}
      id={id}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {label}
    </button>
  );
}
