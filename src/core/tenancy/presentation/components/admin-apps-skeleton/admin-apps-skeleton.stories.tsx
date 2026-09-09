import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppsSkeleton } from './admin-apps-skeleton';

const meta = {
  title: 'Tenancy/AdminAppsSkeleton',
  component: AdminAppsSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminAppsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
