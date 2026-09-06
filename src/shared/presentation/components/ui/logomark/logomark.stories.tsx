import type { Meta, StoryObj } from '@storybook/react';
import { Logomark } from './logomark';

const meta = {
  title: 'UI/Logomark',
  component: Logomark,
  tags: ['autodocs'],
} satisfies Meta<typeof Logomark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: 26 },
};

export const Large: Story = {
  args: { size: 64 },
};
