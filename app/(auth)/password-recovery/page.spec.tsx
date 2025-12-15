import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordRecovery from './page';
import { onSendRecoveryEmail } from '@/http/auth/auth.http';
import { toast } from 'sonner';

jest.mock('next/navigation');
jest.mock('@/http/auth/auth.http');
jest.mock('sonner');

describe('Password Recovery Page', () => {
  const setup = () => {
    const utils = render(<PasswordRecovery />);
    const email = screen.getByPlaceholderText('exemplo@provedor.com');
    const submitButton = screen.getByRole('button', { name: /Enviar/i });
    const link = screen.getByRole('link', { name: /Clique aqui/i });
    return {
      ...utils,
      email,
      submitButton,
      link,
    };
  };

  const mockSendRecoveryEmail = jest.mocked(onSendRecoveryEmail);

  const responseData = {
    status: true,
    date: new Date().toISOString(),
    message: 'E-mail enviado com sucesso.',
    data: {
      email: 'teste@exemplo.com.br',
    },
  };

  const payload = {
    email: 'exemple@provider.com',
  };

  it('it should submit form with the provided e-mail', async () => {
    function deferred<T>() {
      let resolve!: (value: T) => void;

      const promise = new Promise<T>((res) => {
        resolve = res;
      });

      return { promise, resolve };
    }

    const deferredRequest = deferred<typeof responseData>();
    mockSendRecoveryEmail.mockReturnValue(deferredRequest.promise);

    const { email, submitButton } = setup();
    await userEvent.type(email, payload.email);
    await userEvent.click(submitButton);

    const loadingButton = await screen.findByRole('button', {
      name: /entrando/i,
    });

    expect(loadingButton).toBeInTheDocument();

    deferredRequest.resolve(responseData);

    expect(mockSendRecoveryEmail).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        responseData.message,
        expect.anything()
      );
    });

    expect(mockSendRecoveryEmail).toHaveBeenCalledWith(payload);
  });

  it('it should raise an error message if e-mail is not filled', async () => {
    const { submitButton } = setup();

    await userEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      'Por favor, insira um email válido.'
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
