import { getPostList } from '@/http/auth/posts.http';
import { IPost } from '@/interfaces/post.interface';
import { create } from 'zustand';

interface IHomePageInfo {
  title: string;
  post: IPost;
  postList: IPost[];
}

interface IHomeStore {
  pageInfo: IHomePageInfo;
}

const HomeStore = create<IHomeStore>((set, get) => ({
  pageInfo: {
    title: '',
    post: {
      profileFallback: '',
      profileUrl: '',
      name: '',
      description: '',
      mediaList: null,
      timestamp: new Date(),
      likesQty: 0,
      isSaved: false,
      commentsQty: 0,
    },
    postList: [],
  },
  getPostList: getPostList(),
}));

export default HomeStore;
