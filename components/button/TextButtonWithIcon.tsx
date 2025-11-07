'use client';

import { ReactNode } from 'react';

export interface ButtonProps {
  btnClass?: string;
  label: string;
  isDisabled: boolean;
  icon: ReactNode;
  isLeftIcon: boolean;
  ariaLabel?: string;
  id?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: () => void;
}

export default function TextButtonWithIcon({
  btnClass = 'bg-logo hover:bg-logo-hover',
  label,
  isDisabled = false,
  icon,
  isLeftIcon = true,
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
      {isLeftIcon && icon}
      <span className={`flex self-center" ${btnClass}`}>{label}</span>
      {!isLeftIcon && icon}
    </button>
  );
}
