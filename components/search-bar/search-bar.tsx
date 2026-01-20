'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useId } from 'react';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const id = useId();
  return (
    <div className="flex h-10 w-full">
      <input
        id={`search-bar-${id}`}
        className="h-full border border-r-0 rounded-l-md border-gray-400 px-4 py-1 outline-none text-base grow"
        placeholder="Procurar uma palavra..."
      />
      <Button
        type="submit"
        variant="default"
        className={cn('border-l-0 rounded-l-none')}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
