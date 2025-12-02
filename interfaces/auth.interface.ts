export type AuthDataResponse = Omit<ILogin, 'agreedWithTerms' | 'password'>;

export interface ILogin {
  email: string;
  password: string;
}

export type SignUpDataResponse = Omit<ISignUp, 'password'>;

export interface ISignUp {
  email: string;
  password: string;
  name: string;
  birthDate: Date;
}

export interface INewPassword {
  password: string;
}

export interface ICSRFTokenResponse {
  csrfToken: string;
}
