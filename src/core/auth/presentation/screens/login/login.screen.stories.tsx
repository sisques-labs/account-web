import type { Meta, StoryObj } from '@storybook/react';
import { LoginScreen } from './login.screen';
import enDict from '@/core/auth/presentation/i18n/en';

const meta = {
  title: 'Screens/Login',
  component: LoginScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dict: enDict,
    lang: 'en',
  },
};
