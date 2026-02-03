import { httpRequest } from '@/http/http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { IResponseViaCep } from '@/interfaces/web/address.interface';

export const getAddressFromCep = async (
  cep: string
): Promise<IResponseViaCep> => {
  const clearCep = cep.replace(/\D/g, '');
  return await httpRequest({
    apiUrl: `https://viacep.com.br/ws/${clearCep}/json/`,
    method: 'GET',
  });
};
