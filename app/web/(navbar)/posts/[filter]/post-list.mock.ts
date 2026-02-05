import { IPost } from '@/interfaces/web/post.interface';

export const postList: IPost[] = [
  {
    idPost: 1,
    idUser: 1,
    type: 0,
    profileUrl: '/teste1.jpeg',
    name: 'Rafael Horauti 2',
    fallbackName: 'RH',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    mediaList: ['/teste1.jpeg'],
    createdAt: new Date(),
    likesQty: 12,
    isLiked: true,
    commentsQty: 3,
  },
  {
    idPost: 2,
    idUser: 20,
    type: 1,
    profileUrl: '/teste2.jpeg',
    name: 'Daniela Horauti 3',
    fallbackName: 'DH',
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
    commentsQty: 0,
  },
];
