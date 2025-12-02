// This file mocks the behavior of the Next.js App Router hooks

// Jest automatically hoists these mocks, so you don't need to import them manually.

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  // Add other methods used in your component if necessary
};

export const useRouter = jest.fn(() => mockRouter);

// You may need to mock other navigation exports if used:
export const usePathname = jest.fn(() => '/signup');
export const useSearchParams = jest.fn(() => new URLSearchParams());
export const redirect = jest.fn();
