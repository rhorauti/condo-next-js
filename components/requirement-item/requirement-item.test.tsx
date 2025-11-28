import { render, screen } from '@testing-library/react';
import RequirementItem from './requirement-item';

interface IProps {
  isValid: boolean;
  label: string;
}

const setup = (props = {} as IProps) => {
  const { isValid = false, label = '' } = props;
  const utils = render(<RequirementItem isValid={isValid} label={label} />);
  const text = screen.getByText(label);
  const successIcon = screen.queryByRole('img', { name: 'success icon' });
  const failureIcon = screen.queryByRole('img', { name: 'failure icon' });
  const listItem = screen.queryByRole('listitem');
  return {
    ...utils,
    text,
    listItem,
    successIcon,
    failureIcon,
  };
};

it('it should render label via props', () => {
  const { text } = setup({
    label: 'A senha deve ter no mínimo 6 caracteres',
    isValid: false,
  });
  expect(text).toHaveTextContent('A senha deve ter no mínimo 6 caracteres');
});

it('it should render success icon when isValid props is true', () => {
  const { successIcon, failureIcon } = setup({
    label: 'Label Test',
    isValid: true,
  });
  expect(successIcon).toBeInTheDocument();
  expect(failureIcon).not.toBeInTheDocument();
});

it('it should render failure icon when isValid props is false', () => {
  const { successIcon, failureIcon } = setup({
    label: 'Label Test',
    isValid: false,
  });
  expect(successIcon).not.toBeInTheDocument();
  expect(failureIcon).toBeInTheDocument();
});

it('it should render success color for the success icon', () => {
  const { listItem } = setup({ label: 'Label Test', isValid: true });
  expect(listItem).toHaveClass('text-green-600 dark:text-green-400');
});

it('it should render failure color for the falure icon', () => {
  const { listItem } = setup({ label: 'Label Test', isValid: false });
  expect(listItem).toHaveClass('text-destructive');
});
