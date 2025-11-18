import {
  ILogin,
  LoginDataResponse,
  SignUpDataResponse,
} from '@/interfaces/auth.interface';
import { httpRequest } from '../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { SignUpValues } from '@/app/(auth)/signup/page';

export const onLoginUser = async (
  loginData: ILogin
): Promise<IFetchResponse<LoginDataResponse>> => {
  return await httpRequest({
    endpoint: 'login',
    method: 'POST',
    data: loginData,
  });
};

export const onCreateUser = async (
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  // const stringifyData = JSON.stringify(signUpData);
  return await httpRequest({
    endpoint: 'signup',
    method: 'POST',
    data: signUpData,
  });
};
