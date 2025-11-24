import {
  ICSRFTokenResponse,
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
  csrfToken: string,
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  return await httpRequest({
    csrfToken: csrfToken,
    endpoint: 'signup',
    method: 'POST',
    data: signUpData,
  });
};

export const onGetCSRFToken = async (): Promise<
  IFetchResponse<ICSRFTokenResponse>
> => {
  return await httpRequest({
    endpoint: 'csrf-token',
  });
};

export const onValidateToken = async (
  csrfToken: string,
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await httpRequest({
    csrfToken: csrfToken,
    jwtToken: jwtToken,
    endpoint: 'token-validation',
    method: 'POST',
  });
};
