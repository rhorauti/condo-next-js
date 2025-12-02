global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('next/navigation');
jest.mock('../../../http/auth/auth.http');
jest.mock('sooner/toaster');

const mockOnCreateUser = jest.mocked(onCreateUser);

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from './page';
import { onCreateUser } from '@/http/auth/auth.http';
import { toast } from 'sonner';

describe('Sign Up Page', () => {
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
    });

    toast.success('Usuário criado com sucesso.', expect.anything());
  }, 15000);
});
