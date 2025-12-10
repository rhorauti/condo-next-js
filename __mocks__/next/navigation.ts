export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
}));

export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
}));
