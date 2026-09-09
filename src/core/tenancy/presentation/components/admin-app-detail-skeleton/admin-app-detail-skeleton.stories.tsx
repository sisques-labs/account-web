import type { Meta, StoryObj } from '@storybook/react';
import { AdminAppDetailSkeleton } from './admin-app-detail-skeleton';

const meta = {
  title: 'Tenancy/AdminAppDetailSkeleton',
  component: AdminAppDetailSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof AdminAppDetailSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
