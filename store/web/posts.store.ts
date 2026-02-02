import {
  IPost,
  IPostComment,
  IPostSubComment,
} from '@/interfaces/web/post.interface';
import { create } from 'zustand';

interface IPostStore {
  post: IPost;
  postList: IPost[];
  postComment: IPostComment;
  postCommentList: IPostComment[];
  onSetPostList: (postList: IPost[]) => void;
  onSetPost: (post: IPost) => void;
  onSetCommentList: (commentList: IPostComment[]) => void;
  onSetComment: (comment: IPostComment) => void;
  onClearPostList: () => void;
  onClearPost: () => void;
  onClearPostCommentList: () => void;
  onClearPostComment: () => void;
}

const usePostStore = create<IPostStore>((set, get) => ({
  postList: [],
  post: {
    idPost: 0,
    idUser: 0,
    type: 0,
    isLiked: false,
    profileUrl: '',
    name: '',
    fallbackName: '',
    description: '',
    mediaList: null,
    commentsQty: 0,
    createdAt: new Date(),
    likesQty: 0,
    isSaved: false,
  },
  postCommentList: [],
  postComment: {
    idUser: 0,
    idPost: 0,
    idComment: 0,
    isLiked: false,
    profileUrl: '',
    name: '',
    fallbackName: '',
    description: '',
    mediaList: null,
    createdAt: new Date(),
    likesQty: 0,
    subComments: [],
  },
  onSetPostList: (posts: IPost[]) => {
    set({ postList: posts });
  },
  onSetPost: (post: IPost) => {
    set({ post: post });
  },
  onSetCommentList: (commentList: IPostComment[]) => {
    set({ postCommentList: commentList });
  },
  onSetComment: (comment: IPostComment) => {
    set({ postComment: comment });
  },
  onClearPostList: () => {
    set({ postList: [] });
  },
  onClearPost: () => {
    set({
      post: {
        idPost: 0,
        idUser: 0,
        type: 0,
        isLiked: false,
        profileUrl: '',
        name: '',
        fallbackName: '',
        description: '',
        mediaList: null,
        commentsQty: 0,
        createdAt: new Date(),
        likesQty: 0,
        isSaved: false,
      },
    });
  },
  onClearPostCommentList: () => {
    set({ postCommentList: [] });
  },
  onClearPostComment: () => {
    set({
      postComment: {
        idUser: 0,
        idPost: 0,
        idComment: 0,
        isLiked: false,
        profileUrl: '',
        name: '',
        fallbackName: '',
        description: '',
        mediaList: null,
        createdAt: new Date(),
        likesQty: 0,
        subComments: [],
      },
    });
  },
}));

export default usePostStore;
