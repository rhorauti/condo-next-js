import { onHttpRequestJson } from '@/http/http-request';
import { IFetchResponse } from '@/interfaces/response.interface';
import { ILoginRequest, SignUpDataResponse } from '@/interfaces/auth.interface';
import { SignUpValues } from '@/app/(auth)/signup/page';
import { NewPasswordValues } from '@/app/(auth)/new-password/page';
import { PasswordRecoveryValues } from '@/app/(auth)/password-recovery/page';
import { supabase } from '@/app/supabase/supabase.config';

export const onLoginUser = async (loginData: ILoginRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword(loginData);

  if (error || !data.user) {
    throw new Error('Credenciais inválidas');
  }

  return data;
};

export const onSignUpUser = async (
  signUpData: SignUpValues
): Promise<IFetchResponse<SignUpDataResponse>> => {
  return await onHttpRequestJson({
    endpoint: 'auth/signup',
    method: 'POST',
    data: signUpData,
  });
};

export const onSetNewPassword = async (newPasswordData: NewPasswordValues) => {
  const { data, error } = await supabase.auth.updateUser(newPasswordData);

  if (error) {
    throw new Error('Erro ao atualizar a senha.');
  }

  return data;
};

export const onSendRecoveryEmail = async (
  passwordRecoveryData: PasswordRecoveryValues
) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    passwordRecoveryData.email,
    {
      redirectTo: `${window.location.origin}/new-password`,
    }
  );

  if (error) {
    throw new Error('Erro ao enviar e-mail de recuperação de senha.');
  }

  return data;
};
