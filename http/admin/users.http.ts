import { IAdminUsersPageInfo } from '@/interfaces/admin/users.interface';
import { httpRequest } from '../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';

export const onGetAdminUsersPageInfo = async (
  idCondo: number
): Promise<IFetchResponse<IAdminUsersPageInfo>> => {
  return await httpRequest({
    endpoint: `admin/condo/${idCondo}`,
    method: 'GET',
  });
};
