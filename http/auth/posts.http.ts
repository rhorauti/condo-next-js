import { IPost } from '@/interfaces/post.interface';
import { httpRequest } from '../http-request';

export const getPostList = async (): Promise<IPost> => {
  return await httpRequest({ endpoint: '/messages', method: 'GET' });
};
