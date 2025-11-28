import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '@/components/input/password-input';

const setup = (props = {}) => {
  const user = userEvent.setup();
  const utils = render(<PasswordInput {...props} />);
  const input = screen.getByPlaceholderText(
    'Digite sua senha'
  ) as HTMLInputElement;
  const toggleButton = screen.getByTestId('toggle-password-button');
  return {
    user,
    input,
    toggleButton,
    ...utils,
  };
};

it('it should toggle input type from text to password or vice versa', async () => {
  const { user, input, toggleButton } = setup();
  expect(input).toHaveAttribute('type', 'password');
  expect(
    screen.queryByRole('img', { name: /hide-password/i })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: /show-password/i })
  ).not.toBeInTheDocument();

  await user.click(toggleButton);

  expect(input).toHaveAttribute('type', 'text');
  expect(
    screen.queryByRole('img', { name: /hide-password/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: /show-password/i })
  ).toBeInTheDocument();
});

it('it should register text written in the input', async () => {
  const { user, input } = setup();

  await user.type(input, 'Teste123!');

  expect(input).toHaveValue('Teste123!');
});

it('it should change border color to text-destructive if aria-invalid is true', () => {
  const { toggleButton } = setup({ 'aria-invalid': true });

  expect(toggleButton).toHaveClass('text-destructive');
});

it('it should change border color to muted-foreground if aria-invalid is false', () => {
  const { toggleButton } = setup({ 'aria-invalid': false });

  expect(toggleButton).toHaveClass('text-muted-foreground');
});
