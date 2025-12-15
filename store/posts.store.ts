import { getPostList } from '@/http/auth/posts.http';
import { IPost } from '@/interfaces/post.interface';
import { create } from 'zustand';

interface IPageInfo {
  title: string;
  post: IPost;
  postList: IPost[];
}

interface IPostStore {
  pageInfo: IPageInfo;
}

const postStore = create<IPostStore>((set, get) => ({
  pageInfo: {
    title: '',
    post: {
      idPost: 0,
      type: 0,
      isLiked: false,
      profileFallback: '',
      profileUrl: '',
      name: '',
      description: '',
      mediaList: null,
      createdAt: new Date(),
      likesQty: 0,
      isSaved: false,
      commentsQty: 0,
    },
    postList: [],
  },
  getPostList: getPostList(),
}));

export default postStore;
