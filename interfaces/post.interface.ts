export interface IPost {
  idPost: number;
  type: number;
  profileFallback: string;
  profileUrl: string;
  name: string;
  description: string | null;
  mediaList?: string[] | null;
  timestamp: Date;
  likesQty: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsQty: number;
}
