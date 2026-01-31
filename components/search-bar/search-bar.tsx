'use client';

import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useId } from 'react';
import { cn } from '@/lib/utils';

interface ISearchBarProps {
  placeholder?: string;
  onInputText: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onClick: () => void;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Procurar uma palavra...',
  onInputText,
  onKeyDown,
  onClick,
  className,
}: ISearchBarProps) {
  const id = useId();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputText(e.target.value);
  };

  return (
    <div className={cn('flex w-full', className)}>
      <input
        type="search"
        onKeyDown={onKeyDown}
        onInput={handleInput}
        id={`search-bar-${id}`}
        className="border border-r-0 rounded-l-md border-gray-400 px-4 py-1 outline-none text-base grow"
        placeholder={placeholder}
      />
      <Button
        onClick={onClick}
        type="submit"
        variant="default"
        className={cn('border-l-0 border-gray-400 rounded-l-none')}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
