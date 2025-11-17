export interface IFetchResponse<T> {
  status: boolean;
  date: string;
  message: string;
  data?: T;
  error?: string;
}
