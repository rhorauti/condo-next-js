export interface IPost {
  idUser: number;
  idPost: number;
  type?: number;
  profileUrl: string;
  name: string;
  fallbackName: string;
  description: string;
  mediaList: string[] | null;
  createdAt: Date;
  likesQty: number;
  commentsQty: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface IPostComment
  extends Omit<IPost, 'isSaved' | 'type' | 'commentsQty'> {
  idComment: number;
  subComments: IPostSubComment[];
}

export interface IPostSubComment
  extends Omit<IPostComment, 'idPost' | 'idComment' | 'subComments'> {
  idSubComment: number;
}
