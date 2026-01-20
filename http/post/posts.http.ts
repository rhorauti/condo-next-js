import { IPost, IPostComment } from '@/interfaces/post.interface';
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

export const savePostComment = async (
  comment: IPostComment
): Promise<IPost> => {
  return await httpRequest({
    endpoint: `/comments`,
    method: 'POST',
    data: comment,
  });
};

export const deletePostComment = async (idComment: number): Promise<void> => {
  return await httpRequest({
    endpoint: `/comments/${idComment}`,
    method: 'DELETE',
  });
};

export const savePostSubComment = async (
  subComment: IPostComment
): Promise<IPost> => {
  return await httpRequest({
    endpoint: `/sub-comments`,
    method: 'POST',
    data: subComment,
  });
};

export const deletePostSubComment = async (
  idSubComment: number
): Promise<void> => {
  return await httpRequest({
    endpoint: `/sub-comments/${idSubComment}`,
    method: 'DELETE',
  });
};
