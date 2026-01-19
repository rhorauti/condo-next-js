'use client';

import Post from '@/components/post/post';
import { PostFormDialog } from '@/components/post/post-form-dialog';
import SearchBar from '@/components/search-bar/search-bar';
import { Button } from '@/components/ui/button';
import { IPost } from '@/interfaces/post.interface';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth.store';
import { FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

// const postList: IPost[] = [];

const postList: IPost[] = [
  {
    idPost: 12,
    idUser: 1,
    type: 0,
    profileUrl: '/teste1.jpeg',
    name: 'Rafael Horauti 2',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: ['/teste1.jpeg'],
    createdAt: new Date(),
    likesQty: 12,
    isLiked: true,
    isSaved: true,
    comments: [
      {
        idUser: 145,
        profileUrl: '/teste1.jpeg',
        name: 'Rafael Horauti 2',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 10,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Daniela Yukalli Nakano',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 20,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste3.jpeg',
            name: 'Lucas Ryo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 30,
            isLiked: false,
          },
        ],
      },
      {
        idUser: 149,
        profileUrl: '/teste2.jpeg',
        name: 'Rodrigo Horauti',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 50,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Ricardo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 60,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste4.jpeg',
            name: 'Roberta Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 70,
            isLiked: false,
          },
        ],
      },
      {
        idUser: 145,
        profileUrl: '/teste1.jpeg',
        name: 'Rafael Horauti 2',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 10,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Daniela Yukalli Nakano',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 20,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste3.jpeg',
            name: 'Lucas Ryo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 30,
            isLiked: false,
          },
        ],
      },
    ],
  },
  {
    idPost: 12,
    idUser: 20,
    type: 1,
    profileUrl: '/teste2.jpeg',
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
    comments: null,
  },
  {
    idPost: 12,
    idUser: 1,
    type: 3,
    profileUrl: '/teste1.jpeg',
    name: 'Rafael Horauti 2',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: ['/teste1.jpeg'],
    createdAt: new Date(),
    likesQty: 12,
    isLiked: true,
    isSaved: true,
    comments: [
      {
        idUser: 145,
        profileUrl: '/teste1.jpeg',
        name: 'Rafael Horauti 2',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 10,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Daniela Yukalli Nakano',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 20,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste3.jpeg',
            name: 'Lucas Ryo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 30,
            isLiked: false,
          },
        ],
      },
      {
        idUser: 149,
        profileUrl: '/teste2.jpeg',
        name: 'Rodrigo Horauti',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 50,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Ricardo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 60,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste4.jpeg',
            name: 'Roberta Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 70,
            isLiked: false,
          },
        ],
      },
      {
        idUser: 145,
        profileUrl: '/teste1.jpeg',
        name: 'Rafael Horauti 2',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 10,
        isLiked: false,
        comments: [
          {
            idUser: 147,
            profileUrl: '/teste2.jpeg',
            name: 'Daniela Yukalli Nakano',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 20,
            isLiked: false,
          },
          {
            idUser: 148,
            profileUrl: '/teste3.jpeg',
            name: 'Lucas Ryo Horauti',
            description:
              'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
            createdAt: new Date(),
            likesQty: 30,
            isLiked: false,
          },
        ],
      },
    ],
  },
  {
    idPost: 12,
    idUser: 20,
    type: 2,
    profileUrl: '/teste2.jpeg',
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
    comments: null,
  },
];

type Props = {
  filter: 'all' | 'my-posts';
};

export default function PostsPageClient({ filter }: Props) {
  const [isPostDialogActive, setIsPostDialogActive] = useState(false);
  const authStore = useAuthStore();
  const initialPostData = {
    idPost: 0,
    idUser: 0,
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
    comments: null,
  };
  const [postData, setPostData] = useState<IPost>(initialPostData);

  // const filteredPosts =
  //   filter === 'my-posts'
  //     ? postList.filter((post) => post.idUser === authStore.credential.idUser)
  //     : postList;

  const onShowDialog = (post?: IPost): void => {
    setPostData(post ?? initialPostData);
    setIsPostDialogActive(true);
  };

  useEffect(() => {
    console.log('filter', filter);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-6 mb-6 overflow-auto">
        <h1 className="sm:text-2xl text-lg font-semibold">Posts</h1>
        {postList.length == 0 ? (
          <div className="flex flex-col gap-2 justify-center items-center w-full mt-5">
            <FileText size={80} />
            <span>Não existem posts publicados ainda.</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <PostFormDialog
        showDialog={isPostDialogActive}
        postInfo={postData}
        onCloseDialog={() => setIsPostDialogActive(false)}
      />
    </>
  );
}
