'use client';

import Post from '@/components/post/post';
import SearchBar from '@/components/search-bar/search-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const posts = [
  {
    profileUrl: '/teste1.jpeg',
    profileFallback: 'RH',
    name: 'Rafael Horauti',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: null,
    timestamp: new Date(),
    likes: 12,
    isSaved: true,
    commentsQty: 1,
  },
  {
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
    timestamp: new Date(),
    likes: 12,
    isSaved: true,
    commentsQty: 2,
  },
];

export default function Page() {
  const [isDialogActive, setIsDialogActive] = useState(false);

  const onOpenDialog = (index: number): void => {
    setIsDialogActive(true);
  };
  return (
    <>
      <div className="flex justify-center overflow-auto w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col xs:flex-row gap-4">
            <SearchBar />
            <Button variant="default" className={cn('flex gap-2 items-center')}>
              <span className="leading-none">Nova postagem</span>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4">
            {posts.map((post, index) => (
              <Post
                user={post}
                onCommentButtonClick={() => onOpenDialog(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogActive}
        onOpenChange={() => setIsDialogActive(false)}
      >
        <DialogContent className="sm:max-w-[425px]">Teste</DialogContent>
      </Dialog>
    </>
  );
}
