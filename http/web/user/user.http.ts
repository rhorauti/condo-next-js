import { UserDetailSchema } from '@/components/form/profile-form';
import { onHttpRequestFormData, onHttpRequestJson } from '@/http/http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { IUser, IUserDetail } from '@/interfaces/user.interface';

export const onGetAuthUserInfo = async (): Promise<IFetchResponse<IUser>> => {
  return await onHttpRequestJson({
    endpoint: `profiles/me`,
    method: 'GET',
  });
};

export const onGetDetaildUserInfo = async (
  idUser: number
): Promise<IFetchResponse<IUserDetail>> => {
  return await onHttpRequestJson({
    endpoint: `profiles/${idUser}`,
    method: 'GET',
  });
};

export const onGetDetailedAuthUserInfo = async (): Promise<
  IFetchResponse<IUserDetail>
> => {
  return await onHttpRequestJson({
    endpoint: `profiles/me/detail`,
    method: 'GET',
  });
};

export const onUpdateUser = async (
  formData: FormData
): Promise<IFetchResponse<IUserDetail>> => {
  return await onHttpRequestFormData({
    endpoint: 'profiles',
    method: 'POST',
    formData: formData,
  });
};
