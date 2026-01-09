import { IPost } from '@/interfaces/post.interface';
import { httpRequest } from '../http-request';

export const getPostList = async (): Promise<IPost[]> => {
  return await httpRequest({ endpoint: '/posts', method: 'GET' });
};

export const getPost = async (idPost: number): Promise<IPost> => {
  return await httpRequest({ endpoint: `/posts/${idPost}`, method: 'GET' });
};

export const savePost = async (post: IPost): Promise<IPost> => {
  return await httpRequest({ endpoint: '/posts', method: 'POST', data: post });
};

export const deletePost = async (idPost: number): Promise<void> => {
  return await httpRequest({ endpoint: `/posts/${idPost}`, method: 'DELETE' });
};

export const onGetPostComments = async (idPost: number): Promise<IPost[]> => {
  return await httpRequest({
    endpoint: `posts/comments/${idPost}`,
    method: 'GET',
  });
};
