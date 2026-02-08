export type AuthDataResponse = Omit<ILoginRequest, 'password'>;

export interface ILoginRequest {
  email: string;
  password: string;
}

export type SignUpDataResponse = Omit<ISignUp, 'password'>;

export interface ISignUp extends ILoginRequest {
  name: string;
  birthDate: Date;
}

export type INewPassword = Omit<ILoginRequest, 'email'>;

export interface ICSRFTokenResponse {
  csrfToken: string;
}

export interface IAuthUser extends ISignUp {}
