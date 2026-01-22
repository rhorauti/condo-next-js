'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { BookmarkIcon, HeartIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);

  return (
    <>
      <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
        Página específica de um produto do marketplace
        <footer>
          <ToggleGroup
            type="multiple"
            variant="default"
            className={cn('justify-evenly')}
            size="sm"
          >
            <ToggleGroupItem
              value="post"
              aria-label="Toggle post"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 flex justify-center"
            >
              <MessageCircle />
              <span>0</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heart"
              aria-label="Toggle heart"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center"
            >
              <HeartIcon
                className={` ${isPostLiked ? 'fill-red-500 text-red-500' : 'fill-transparent text-black dark:text-white'}`}
              />
              <span>1</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bookmark"
              aria-label="Toggle bookmark"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 flex justify-center"
            >
              <BookmarkIcon
                className={`${isPostSaved ? 'fill-gray-500 text-gray-500' : 'fill-transparent text-black dark:text-white'}`}
              />
            </ToggleGroupItem>
          </ToggleGroup>
        </footer>
      </article>
    </>
  );
}
