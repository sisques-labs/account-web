import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordScreen } from './forgot-password.screen';
import enDict from '@/core/auth/presentation/i18n/en';

const meta = {
  title: 'Screens/ForgotPassword',
  component: ForgotPasswordScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof ForgotPasswordScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dict: enDict,
    lang: 'en',
  },
};
