import {
  ILogin,
  AuthDataResponse,
  SignUpDataResponse,
} from '@/interfaces/auth.interface';
import { httpRequest } from '../http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { SignUpValues } from '@/app/(auth)/signup/page';
import { NewPasswordValues } from '@/app/(auth)/new-password/page';
import { PasswordRecoveryValues } from '@/app/(auth)/password-recovery/page';
import { LoginFormValues } from '@/app/(auth)/login/page';

export const onLoginUser = async (
  loginData: ILogin
): Promise<IFetchResponse<LoginFormValues>> => {
  return await httpRequest({
    endpoint: 'login',
    method: 'POST',
    data: loginData,
  });
};

export const onCreateUser = async (
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  return await httpRequest({
    endpoint: 'signup',
    method: 'POST',
    data: signUpData,
  });
};

export const onSetNewPassword = async (
  jwtToken: string,
  newPasswordData: NewPasswordValues
): Promise<IFetchResponse<AuthDataResponse>> => {
  return await httpRequest({
    jwtToken: jwtToken,
    endpoint: 'new-password',
    method: 'POST',
    data: newPasswordData,
  });
};

export const onSendRecoveryEmail = async (
  passwordRecoveryData: PasswordRecoveryValues
): Promise<IFetchResponse<AuthDataResponse>> => {
  return await httpRequest({
    endpoint: 'password-recovery',
    method: 'POST',
    data: passwordRecoveryData,
  });
};

export const onValidateEmail = async (
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await httpRequest({
    jwtToken: jwtToken,
    endpoint: 'validate-email',
    method: 'POST',
  });
};

export const onValidateToken = async (
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await httpRequest({
    jwtToken: jwtToken,
    endpoint: 'token-validation',
    method: 'POST',
  });
};
