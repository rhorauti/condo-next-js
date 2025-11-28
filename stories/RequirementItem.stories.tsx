import type { Meta, StoryObj } from '@storybook/react';
import RequirementItem from '@/components/requirement-item/requirement-item';

const meta = {
  title: 'Components/Requirement Item',
  component: RequirementItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    background: {
      options: {
        light: { name: 'Light', value: '#fff' },
        dark: { name: 'Dark', value: '#333' },
      },
    },
  },
  decorators: [
    (Story) => (
      <ul className="list-none p-4 w-64 border rounded-md shadow-sm">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof RequirementItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. The "Success" State
 */
export const Valid: Story = {
  args: {
    isValid: true,
    label: 'At least 8 characters',
  },
};

/**
 * 2. The "Error" State
 */
export const Invalid: Story = {
  args: {
    isValid: false,
    label: 'At least 8 characters',
  },
};

/**
 * 3. A "Long Text" Example (to test responsiveness)
 */
export const LongText: Story = {
  args: {
    isValid: false,
    label:
      'Must contain at least one special character (!@#$%) and an uppercase letter.',
  },
};

/**
 * 4. Simulating a Real List (Using render function)
 */
export const SimulatedList: Story = {
  args: {
    isValid: true,
    label: 'Default requirement',
  },
  render: () => (
    <ul className="space-y-2 w-80">
      <RequirementItem isValid={true} label="At least 8 characters" />
      <RequirementItem isValid={true} label="One number" />
      <RequirementItem isValid={false} label="One special character" />
      <RequirementItem isValid={false} label="One uppercase letter" />
    </ul>
  ),
};
