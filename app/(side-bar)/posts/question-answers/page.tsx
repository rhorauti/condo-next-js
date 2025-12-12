'use client';

import Post from '@/components/post/post';
import SearchBar from '@/components/search-bar/search-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Description } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const posts = [
  {
    idPost: 12,
    type: 0,
    profileUrl: '/teste1.jpeg',
    profileFallback: 'RH',
    name: 'Rafael Horauti',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: ['/teste1.jpeg'],
    createdAt: new Date(),
    likesQty: 12,
    isLiked: true,
    isSaved: true,
    commentsQty: 1,
  },
  {
    idPost: 12,
    type: 0,
    profileUrl: '/teste2.jpeg',
    profileFallback: 'RH',
    name: 'Daniela Horauti',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: [
      '/post.jpg',
      '/teste1.jpeg',
      '/teste2.jpeg',
      '/teste3.jpeg',
      '/teste4.jpeg',
    ],
    createdAt: new Date(),
    likesQty: 12,
    isLiked: false,
    isSaved: true,
    commentsQty: 2,
  },
];

export default function Page() {
  return (
    <>
      <div className="flex justify-center overflow-auto w-full">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col xs:flex-row gap-4">
            <div className={cn('grow')}>
              <SearchBar />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="default">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4">
            {posts.map((post, index) => (
              <Post key={index} user={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
