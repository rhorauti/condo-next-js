import { render, screen, waitFor } from '@testing-library/react';
import LoginForm from './page';
import userEvent from '@testing-library/user-event';

// Mock the entire auth module using relative path
jest.mock('../../../http/auth/auth.http', () => ({
  onLoginUser: jest.fn(),
  onCreateUser: jest.fn(),
  onForgotPassword: jest.fn(),
  onResetPassword: jest.fn(),
  onCheckEmailAvailability: jest.fn(),
  onResendVerifyEmail: jest.fn(),
}));

// Import after mocking
import { onLoginUser } from '../../../http/auth/auth.http';
const mockOnLoginUser = onLoginUser as jest.MockedFunction<typeof onLoginUser>;

beforeEach(() => {
  jest.clearAllMocks();
});

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
});

it('it should show an error message when e-mail is not correct', async () => {
  const { user, button } = setup();

  // This test doesn't need to mock onLoginUser since it tests validation errors
  // that should prevent the function from being called

  await user.click(button);

  await waitFor(() => {
    expect(
      screen.getByText(/Por favor, insira um email válido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A senha deve ter no mínimo 6 caracteres/i)
    ).toBeInTheDocument();
  });
});
