import { PasswordInput } from '@/components/input/password-input';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('password-input');
    await expect(input).toHaveAttribute('type', 'password');
  },
};

/**
 * Default state with input type text
 */
export const DefaultStateTypeText: Story = {
  args: {
    'aria-invalid': false,
    placeholder: placeholder,
    value: 'Teste123!',
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByTestId('toggle-password-button');
    const input = canvas.getByTestId('password-input');
    await userEvent.click(toggleButton);
    await expect(input).toHaveAttribute('type', 'text');
  },
};
