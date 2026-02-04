import { LoginFormValues } from '@/app/web/(auth)/login/page';
import { NewPasswordValues } from '@/app/web/(auth)/new-password/page';
import { PasswordRecoveryValues } from '@/app/web/(auth)/password-recovery/page';
import { SignUpValues } from '@/app/web/(auth)/signup/page';
import { onHttpRequestJson } from '@/http/http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import {
  ILogin,
  AuthDataResponse,
  SignUpDataResponse,
} from '@/interfaces/web/auth.interface';

export const onLoginUser = async (
  loginData: ILogin
): Promise<IFetchResponse<LoginFormValues>> => {
  return await onHttpRequestJson({
    endpoint: 'login',
    method: 'POST',
    data: loginData,
  });
};

export const onCreateUser = async (
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  return await onHttpRequestJson({
    endpoint: 'signup',
    method: 'POST',
    data: signUpData,
  });
};

export const onSetNewPassword = async (
  jwtToken: string,
  newPasswordData: NewPasswordValues
): Promise<IFetchResponse<AuthDataResponse>> => {
  return await onHttpRequestJson({
    jwtToken: jwtToken,
    endpoint: 'new-password',
    method: 'POST',
    data: newPasswordData,
  });
};

export const onSendRecoveryEmail = async (
  passwordRecoveryData: PasswordRecoveryValues
): Promise<IFetchResponse<AuthDataResponse>> => {
  return await onHttpRequestJson({
    endpoint: 'password-recovery',
    method: 'POST',
    data: passwordRecoveryData,
  });
};

export const onValidateEmail = async (
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await onHttpRequestJson({
    jwtToken: jwtToken,
    endpoint: 'validate-email',
    method: 'POST',
  });
};

export const onValidateToken = async (
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await onHttpRequestJson({
    jwtToken: jwtToken,
    endpoint: 'token-validation',
    method: 'POST',
  });
};
