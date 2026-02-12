import { IFetchResponse } from '@/interfaces/response.interface';
import { onHttpRequestJson } from '@/http/http-request';
import { IAddress, IAddressDetail } from '@/interfaces/address.interface';

const basePath = 'address';

export const getAddressList = async (): Promise<IFetchResponse<IAddress[]>> => {
  return await onHttpRequestJson({ endpoint: basePath, method: 'GET' });
};

export const onGetAddress = async (
  idAddress: number
): Promise<IFetchResponse<IAddressDetail>> => {
  return await onHttpRequestJson({
    endpoint: `${basePath}/${idAddress}`,
    method: 'GET',
  });
};

export const onSaveAddress = async (
  formData: IAddressDetail
): Promise<IFetchResponse<IAddressDetail>> => {
  return await onHttpRequestJson({
    endpoint: basePath,
    method: 'POST',
    data: formData,
  });
};

export const onDeleteAddress = async (
  idAddress: number
): Promise<IFetchResponse> => {
  return await onHttpRequestJson({
    endpoint: `${basePath}/${idAddress}`,
    method: 'DELETE',
  });
};
