import { POST_TYPE } from '@/enum/post.enum';

export interface IPost {
  idUser: number;
  idPost: number;
  type?: POST_TYPE;
  profileUrl?: string | null;
  name?: string;
  fallbackName?: string;
  description: string;
  mediaList: string[] | null;
  createdAt: Date;
  likesQty: number;
  commentsQty: number;
  isLiked: boolean;
}

export interface IPostComment
  extends Omit<IPost, 'isSaved' | 'type' | 'commentsQty'> {
  idComment: number | null;
  subComments: IPostSubComment[] | null;
}

export interface IPostSubComment
  extends Omit<IPostComment, 'idPost' | 'subComments'> {
  idParent: number | null;
}
