global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('next/navigation');
jest.mock('@/http/auth/auth.http');
jest.mock('sonner');

const mockUseRouter = jest.mocked(useRouter);
const mockOnCreateUser = jest.mocked(onCreateUser);

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp, { FORM_ERRORS } from './page';
import { onCreateUser } from '@/http/auth/auth.http';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

describe('Sign Up Page', () => {
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

    jest.clearAllMocks();
  });

  const setup = () => {
    const utils = render(<SignUp />);
    const name = screen.getByRole('textbox', { name: /nome/i });
    const birthDateButton = screen.getByRole('button', {
      name: /data de nascimento/i,
    });
    const email = screen.getByRole('textbox', { name: /e-mail/i });
    const password = screen.getByLabelText(/senha/i);
    const agreedWithTerms = screen.getByRole('checkbox', {
      name: /agree with terms/i,
    });
    const submitButton = screen.getByRole('button', { name: /criar usuário/i });
    return {
      ...utils,
      name,
      birthDateButton,
      email,
      password,
      agreedWithTerms,
      submitButton,
    };
  };

  const signUpData = {
    name: 'Fulano Silva',
    birthDate: new Date('2000-12-01T02:00:00.000Z'),
    email: 'teste@exemplo.com.br',
    password: 'Teste123!',
    agreedWithTerms: true,
  };

  it('it should submit form with correct data', async () => {
    const {
      email,
      name,
      birthDateButton,
      password,
      agreedWithTerms,
      submitButton,
    } = setup();

    mockOnCreateUser.mockResolvedValue({
      status: true,
      date: new Date().toISOString(),
      message: 'Usuário criado com sucesso.',
      data: signUpData,
    });

    await userEvent.type(name, signUpData.name);
    await userEvent.type(email, signUpData.email);
    await userEvent.type(password, signUpData.password);
    await userEvent.click(agreedWithTerms);

    expect(screen.queryByText(/selecione uma data/i)).toBeInTheDocument();
    await userEvent.click(birthDateButton);
    const yearDropdown = screen.getByRole('combobox', { name: /year/i });
    await userEvent.selectOptions(yearDropdown, '2000');
    const dayOne = screen.getByRole('button', { name: /December 1st, 2000/i });
    await userEvent.click(dayOne);
    await waitFor(() => {
      expect(birthDateButton).not.toHaveTextContent(/selecione uma data/i);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnCreateUser).toHaveBeenCalledTimes(1);
      expect(mockOnCreateUser).toHaveBeenCalledWith(signUpData);
      expect(toast.success).toHaveBeenCalledWith(
        'Usuário criado com sucesso.',
        expect.anything()
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  }, 15000);

  it('it should raise error message below each input', async () => {
    const { submitButton } = setup();

    await userEvent.click(submitButton);

    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.name, 'i'))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.email.invalid, 'i'))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.terms, 'i'))
    ).toBeInTheDocument();
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
    expect(
      await screen.findByText(new RegExp(FORM_ERRORS.birthDate.invalid, 'i'))
    ).toBeInTheDocument();
  });

  it('it should raise an error duo to e-mail already exist', async () => {
    const {
      email,
      password,
      name,
      birthDateButton,
      agreedWithTerms,
      submitButton,
    } = setup();
    const message = 'Email já cadastrado.';

    mockOnCreateUser.mockResolvedValue({
      status: false,
      date: new Date().toISOString(),
      message: message,
    });

    await userEvent.type(name, signUpData.name);
    await userEvent.type(email, signUpData.email);
    await userEvent.type(password, signUpData.password);
    await userEvent.click(agreedWithTerms);

    expect(screen.queryByText(/selecione uma data/i)).toBeInTheDocument();
    await userEvent.click(birthDateButton);
    const yearDropdown = screen.getByRole('combobox', { name: /year/i });
    await userEvent.selectOptions(yearDropdown, '2000');
    const dayOne = screen.getByRole('button', { name: /December 1st, 2000/i });
    await userEvent.click(dayOne);
    await waitFor(() => {
      expect(birthDateButton).not.toHaveTextContent(/selecione uma data/i);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnCreateUser).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(message, expect.anything());
    });
  }, 15000);
});
