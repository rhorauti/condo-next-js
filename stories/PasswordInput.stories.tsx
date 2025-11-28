import { PasswordInput } from '@/components/input/password-input';
import type { Meta, StoryObj } from '@storybook/react';
import { screen } from 'storybook/test';

const placeholder = 'Digite sua senha';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    'aria-invalid': {
      control: 'boolean',
      description: 'Indicates if the field has a validation error.',
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with input type password
 */
export const DefaultStateTypePassword: Story = {
  args: {
    'aria-invalid': false,
    placeholder: placeholder,
    value: 'Teste123!',
    readOnly: true,
  },
};

/**
 * Default state with input type text
 */
// export const DefaultStateTypeText: Story = {
//   args: {
//     'aria-invalid': false,
//     placeholder: placeholder,
//     value: 'Teste123!',
//     readOnly: true,
//   },
//   play: async ({ userEvent }) => {
//     await userEvent.click(screen.getByTestId('toggle-password-button'));
//   },
// };

export const DefaultStateTypeText: Story = {
  render: (args) => (
    <PasswordInput
      aria-invalid={true}
      placeholder={placeholder}
      value="Test123!"
      readOnly={true}
    />
  ),
};

/**
 * Invalid state
 */
export const InvalidState: Story = {
  args: {
    'aria-invalid': true,
    placeholder: placeholder,
    value: 'Teste123!',
    readOnly: true,
  },
};
