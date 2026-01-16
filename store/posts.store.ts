import { getPostList } from '@/http/auth/posts.http';
import { IPost } from '@/interfaces/post.interface';
import { create } from 'zustand';

interface IPostStore {
  title: string;
  post: IPost;
  postList: IPost[];
  getPostList: () => Promise<void>;
}

const usePostStore = create<IPostStore>((set, get) => ({
  title: '',
  post: {
    idPost: 0,
    idUser: 0,
    type: 0,
    isLiked: false,
    profileUrl: '',
    name: '',
    description: '',
    mediaList: null,
    createdAt: new Date(),
    likesQty: 0,
    isSaved: false,
    comments: [],
  },
  postList: [],
  getPostList: async () => {
    const posts = await getPostList();
    set({ postList: posts });
  },
}));

export default usePostStore;
