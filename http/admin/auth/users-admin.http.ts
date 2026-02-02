import {
  IAdminUserHome,
  IAdminUsersHome,
} from '@/interfaces/admin/admin-users.interface';
import { httpRequest } from '../../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { IUserDetail } from '@/interfaces/user.interface';

export const onGetAdminUsersPageInfo = async (
  idCondo: number
): Promise<IFetchResponse<IAdminUsersHome>> => {
  return await httpRequest({
    endpoint: `admin/condo/${idCondo}`,
    method: 'GET',
  });
};

export const onChangeUserActivationStatus = async (
  idCondo: number,
  idUser: number
): Promise<IFetchResponse<IAdminUserHome>> => {
  return await httpRequest({
    endpoint: `admin/condo/${idCondo}/users/${idUser}`,
    method: 'GET',
  });
};

export const onGetAdminUserInfo = async (
  idCondo: number,
  idUser: number
): Promise<IFetchResponse<IUserDetail>> => {
  return await httpRequest({
    endpoint: `admin/condo/${idCondo}/users/${idUser}`,
    method: 'GET',
  });
};
