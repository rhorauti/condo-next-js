import { onHttpRequestJson } from '@/http/http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { ILoginRequest, SignUpDataResponse } from '@/interfaces/auth.interface';
import { SignUpValues } from '@/app/(auth)/signup/page';
import { NewPasswordValues } from '@/app/(auth)/new-password/page';
import { PasswordRecoveryValues } from '@/app/(auth)/password-recovery/page';

export const onLoginUser = async (
  loginData: ILoginRequest
): Promise<IFetchResponse<{ email: string }>> => {
  return await onHttpRequestJson({
    endpoint: 'auth/email',
    method: 'POST',
    data: loginData,
  });
};

export const onSignUpUser = async (
  accessToken: string,
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  return await onHttpRequestJson({
    accessToken: accessToken,
    endpoint: 'auth/signup',
    method: 'POST',
    data: signUpData,
  });
};

export const onSetNewPassword = async (
  accessToken: string,
  newPasswordData: NewPasswordValues
): Promise<IFetchResponse<{ email: string }>> => {
  return await onHttpRequestJson({
    accessToken: accessToken,
    endpoint: 'auth/new-password',
    method: 'POST',
    data: newPasswordData,
  });
};

export const onSendRecoveryEmail = async (
  passwordRecoveryData: PasswordRecoveryValues
): Promise<IFetchResponse<{ email: string }>> => {
  return await onHttpRequestJson({
    endpoint: 'auth/password-recovery',
    method: 'POST',
    data: passwordRecoveryData,
  });
};

export const onValidateToken = async (
  jwtToken: string
): Promise<IFetchResponse<string>> => {
  return await onHttpRequestJson({
    accessToken: jwtToken,
    endpoint: 'auth/token-validation',
    method: 'POST',
  });
};
