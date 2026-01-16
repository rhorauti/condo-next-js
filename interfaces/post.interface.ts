export interface IPost {
  idUser: number;
  idPost: number;
  type?: number;
  profileUrl: string;
  name: string;
  description: string;
  mediaList: string[] | null;
  createdAt: Date;
  likesQty: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: IPostComment[] | null;
}

export interface IPostComment {
  idUser: number;
  profileUrl: string;
  name: string;
  description: string;
  createdAt: Date;
  likesQty: number;
  isLiked: boolean;
  comments?: IPostComment[] | null;
}
