'use client';

import { FaEnvelope } from 'react-icons/fa';

export interface InputProps {
  id?: string;
  divClass?: string;
  inputValue?: string;
  onHandleInput?: (inputValue: string) => void;
  onHandleKeyDown?: () => void;
  onHandleClick?: () => void;
}

export function EmailInput({
  id,
  divClass,
  inputValue,
  onHandleInput,
  onHandleKeyDown,
  onHandleClick,
}: InputProps) {
  return (
    <div
      className={`${divClass} flex justify-between border border-logo rounded-md w-full`}
    >
      <input
        id={id}
        type="email"
        placeholder="exemplo@test.com"
        value={inputValue}
        autoComplete="off"
        onInput={(e) => {
          onHandleInput?.((e.target as HTMLInputElement).value);
        }}
        onKeyDown={onHandleKeyDown}
        className="flex-1 bg-transparent w-full focus:outline-none pl-3 pr-1 py-1 disabled:bg-gray-100 disabled:text-gray-600 disabled:border-1 disabled:rounded-md placeholder:text-sm"
      />
      <button
        onClick={onHandleClick}
        type="button"
        className="inline-flex items-center mr-1"
      >
        <FaEnvelope className="text-logo font-semibold" />
      </button>
    </div>
  );
}

export default EmailInput;
