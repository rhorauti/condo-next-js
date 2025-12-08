export interface IPost {
  profileFallback: string;
  profileUrl: string;
  name: string;
  description: string | null;
  mediaList?: string[] | null;
  timestamp: Date;
  likes: number;
  isSaved: boolean;
  commentsQty: number;
}
