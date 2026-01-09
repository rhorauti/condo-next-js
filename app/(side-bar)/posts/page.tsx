'use client';

import Post from '@/components/post/post';
import { PostFormDialog } from '@/components/post/post-form-dialog';
import SearchBar from '@/components/search-bar/search-bar';
import { Button } from '@/components/ui/button';
import { IPost } from '@/interfaces/post.interface';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const postList = [
  {
    idPost: 12,
    type: 0,
    profileUrl: '/teste1.jpeg',
    profileFallback: 'RH',
    name: 'Rafael Horauti 2',
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
    name: 'Daniela Horauti 3',
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
  const [isPostDialogActive, setIsPostDialogActive] = useState(false);
  const initialPostData = {
    idPost: 0,
    type: 0,
    profileFallback: '',
    profileUrl: '',
    name: '',
    description: '',
    mediaList: [],
    createdAt: new Date(),
    likesQty: 0,
    isLiked: false,
    isSaved: false,
  };
  const [postData, setPostData] = useState<IPost>(initialPostData);

  const onShowDialog = (post?: IPost): void => {
    setPostData(post ?? initialPostData);
    setIsPostDialogActive(true);
  };

  return (
    <>
      <div className="flex justify-center overflow-auto w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-4 items-center justify-center w-full xs:flex-row">
            <SearchBar />
            <Button
              variant="default"
              className="w-full xs:w-auto"
              onClick={() => onShowDialog()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4">
            {postList.map((post, index) => (
              <Post
                key={index}
                postInfo={post}
                onShowPostDialog={() => onShowDialog(post)}
              />
            ))}
          </div>
        </div>
      </div>
      <PostFormDialog
        showDialog={isPostDialogActive}
        postInfo={postData}
        onCloseDialog={() => setIsPostDialogActive(false)}
      />
    </>
  );
}
