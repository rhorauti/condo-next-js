import { render, screen, waitFor } from '@testing-library/react';
import LoginForm from './page';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

jest.mock('@/http/auth/auth.http');
jest.mock('sonner');

import { onLoginUser } from '@/http/auth/auth.http';
const mockOnLoginUser = jest.mocked(onLoginUser);

describe('Login Page Component', () => {
  const setup = () => {
    const utils = render(<LoginForm />);
    const email = screen.getByPlaceholderText(/exemplo@provedor.com/i);
    const password = screen.getByPlaceholderText(/digite sua senha/i);
    const button = screen.getByRole('button', { name: /entrar/i });
    const user = userEvent.setup();
    return {
      ...utils,
      email,
      password,
      user,
      button,
    };
  };

  const credentials = {
    email: 'usuario@exemplo.com',
    password: 'mySecretPassword123',
  };

  it('it should submit the form with e-mail and password', async () => {
    const { email, password, user, button } = setup();

    mockOnLoginUser.mockResolvedValue({
      status: true,
      date: new Date().toISOString(),
      message: 'Login efetuado com sucesso.',
      data: { email: credentials.email, password: credentials.password },
    });

    await user.type(email, credentials.email);
    await user.type(password, credentials.password);
    await user.click(button);

    await waitFor(() => {
      expect(mockOnLoginUser).toHaveBeenCalledTimes(1);
      expect(mockOnLoginUser).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password,
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Login efetuado com sucesso!',
      expect.anything()
    );
  });

  it('it should show an error message when e-mail is not correct', async () => {
    const { user, button, email, password } = setup();

    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/Por favor, insira um email válido/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/A senha deve ter no mínimo 6 caracteres/i)
      ).toBeInTheDocument();
      expect(email).toHaveClass('border-destructive focus-visible:shadow-none');
      expect(password).toHaveClass(
        'border-destructive focus-visible:shadow-none'
      );
    });
  });

  it('it should show button label Entrando... and button state is disabled when isSubmitting variable is true', async () => {
    const { user, button, email, password } = setup();

    mockOnLoginUser.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        status: true,
        date: new Date().toISOString(),
        message: 'Login efetuado com sucesso.',
        data: { email: credentials.email, password: credentials.password },
      };
    });

    await user.type(email, credentials.email);
    await user.type(password, credentials.password);
    const clickPromise = user.click(button);
    const loadingButton = await screen.findByRole('button', {
      name: /Entrando.../i,
    });

    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    await clickPromise;
  });

  it('It should show a toast error when API throws an exception', async () => {
    const { user, email, password, button } = setup();
    const errorMessage = 'Email ou senha inválidos';
    mockOnLoginUser.mockRejectedValue(new Error(errorMessage));

    await user.type(email, credentials.email);
    await user.type(password, credentials.password);
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage, expect.anything());
    });
  });

  it('it should verify Forget Password Link exists', () => {
    setup();
    const link = screen.queryByRole('link', { name: /clique aqui/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/password-recovery');
  });
});
