export type LoginDataResponse = Omit<ILogin, 'agreedWithTerms' | 'password'>;

export interface ILogin {
  email: string;
  password: string;
  agreedWithTerms: boolean;
}

export type SignUpDataResponse = Omit<ISignUp, 'password'>;

export interface ISignUp {
  email: string;
  password: string;
  name: string;
  birthDate: string;
}
