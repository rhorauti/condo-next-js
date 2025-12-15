global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('next/navigation');
jest.mock('@/http/auth/auth.http');
jest.mock('sonner');

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { onSetNewPassword } from '@/http/auth/auth.http';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import NewPassword from './page';
import { FORM_ERRORS } from '../signup/page';

const MOCK_TOKEN = 'mock-jwt-token-from-url-params';
const mockUseRouter = jest.mocked(useRouter);
const mockUseSearchParams = jest.mocked(useSearchParams);
const mockOnUpdatePassword = jest.mocked(onSetNewPassword);

const payload = {
  password: 'Teste123!',
};

const responseData = {
  status: true,
  date: new Date().toISOString(),
  message: 'Senha atualizada com sucesso.',
  data: {
    email: 'teste@exemplo.com.br',
  },
};

describe('New Password Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'token') {
          return MOCK_TOKEN;
        }
        return null;
      }),
    } as any);

    jest.clearAllMocks();
  });

  const setup = () => {
    const utils = render(<NewPassword />);
    const password = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });
    return {
      ...utils,
      password,
      submitButton,
    };
  };

  it('it should submit form with correct data', async () => {
    const { password, submitButton } = setup();
    mockOnUpdatePassword.mockResolvedValue(responseData);

    await userEvent.type(password, payload.password);
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnUpdatePassword).toHaveBeenCalledTimes(1);
      expect(mockOnUpdatePassword).toHaveBeenCalledWith(MOCK_TOKEN, payload);
      expect(toast.success).toHaveBeenCalledWith(
        'Senha atualizada com sucesso.',
        expect.anything()
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('it should raise error message below each input', async () => {
    const { submitButton } = setup();

    await userEvent.click(submitButton);

    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.password.min, 'i'))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.password.uppercase, 'i'))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.password.number, 'i'))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.password.symbol, 'i'))
    ).toBeInTheDocument();
  });
});
