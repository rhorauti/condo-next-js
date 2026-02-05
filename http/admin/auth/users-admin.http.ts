import {
  IAdminUserHome,
  IAdminUsersHome,
} from '@/interfaces/admin/admin-users.interface';
import { onHttpRequestJson } from '../../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { IUserDetail } from '@/interfaces/user.interface';
import { AdminEmailUserSchema } from '@/components/dialog/email-send.dialog';

export const onGetAdminUsersPageInfo = async (
  idCondo: number
): Promise<IFetchResponse<IAdminUsersHome>> => {
  return await onHttpRequestJson({
    endpoint: `admin/condo/${idCondo}`,
    method: 'GET',
  });
};

export const onChangeUserActivationStatus = async (
  idCondo: number,
  idUser: number
): Promise<IFetchResponse<IAdminUserHome>> => {
  return await onHttpRequestJson({
    endpoint: `admin/condo/${idCondo}/users/${idUser}`,
    method: 'GET',
  });
};

export const onGetAdminUserInfo = async (
  idCondo: number,
  idUser: number
): Promise<IFetchResponse<IUserDetail>> => {
  return await onHttpRequestJson({
    endpoint: `admin/condo/${idCondo}/users/${idUser}`,
    method: 'GET',
  });
};

export const onSendEmailToCreateUser = async (
  user: AdminEmailUserSchema
): Promise<IFetchResponse<AdminEmailUserSchema>> => {
  return await onHttpRequestJson({
    endpoint: 'admin/send-signup-email',
    method: 'POST',
    data: user,
  });
};
