import { onHttpExternalRequest } from '@/http/http-request';
import { IResponseViaCep } from '@/interfaces/address.interface';

export const getAddressFromCep = async (
  cep: string
): Promise<IResponseViaCep> => {
  const clearCep = cep.replace(/\D/g, '');
  return await onHttpExternalRequest({
    url: `https://viacep.com.br/ws/${clearCep}/json/`,
    method: 'GET',
  });
};
