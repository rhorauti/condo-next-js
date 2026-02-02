import {
  IPost,
  IPostComment,
  IPostSubComment,
} from '@/interfaces/web/post.interface';
import { httpRequest } from '../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';

export const getPostList = async (): Promise<IFetchResponse<IPost[]>> => {
  return await httpRequest({ endpoint: '/posts', method: 'GET' });
};

export const getPost = async (
  idPost: number
): Promise<IFetchResponse<IPost>> => {
  return await httpRequest({ endpoint: `/posts/${idPost}`, method: 'GET' });
};

export const savePost = async (
  formData: FormData
): Promise<IFetchResponse<IPost>> => {
  return await httpRequest({
    endpoint: 'posts',
    method: 'POST',
    data: formData,
  });
};

export const deletePost = async (idPost: number): Promise<IFetchResponse> => {
  return await httpRequest({ endpoint: `/posts/${idPost}`, method: 'DELETE' });
};

export const getPostCommentList = async (
  idPost: number
): Promise<IFetchResponse<IPostComment[]>> => {
  return await httpRequest({
    endpoint: `posts/${idPost}/comments`,
    method: 'GET',
  });
};

export const savePostComment = async (
  idPost: number,
  comment: IPostComment
): Promise<IFetchResponse<IPost>> => {
  return await httpRequest({
    endpoint: `posts/${idPost}/comments`,
    method: 'POST',
    data: comment,
  });
};

export const deletePostComment = async (
  idPost: number,
  idComment: number
): Promise<IFetchResponse> => {
  return await httpRequest({
    endpoint: `posts/${idPost}/comments/${idComment}`,
    method: 'DELETE',
  });
};

export const savePostSubComment = async (
  idPost: number,
  idComment: number,
  subComment: IPostComment
): Promise<IFetchResponse<IPostSubComment>> => {
  return await httpRequest({
    endpoint: `posts/${idPost}/comments/${idComment}/sub-comments`,
    method: 'POST',
    data: subComment,
  });
};

export const deletePostSubComment = async (
  idPost: number,
  idComment: number,
  idSubComment: number
): Promise<IFetchResponse> => {
  return await httpRequest({
    endpoint: `posts/${idPost}/comments/${idComment}/sub-comments/${idSubComment}`,
    method: 'DELETE',
  });
};
