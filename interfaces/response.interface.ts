export interface IFetchResponse<T = void> {
  status: boolean;
  date: string;
  message: string;
  data?: T;
  error?: string;
}

export interface IError {
  status: boolean;
  date: string;
  message: string;
}
