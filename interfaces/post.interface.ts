export interface IPost {
  idPost: number;
  type?: number;
  profileUrl: string;
  name: string;
  description: string | null;
  mediaList?: string[] | null;
  createdAt: Date;
  likesQty: number;
  isLiked: boolean;
  isSaved: boolean;
}
