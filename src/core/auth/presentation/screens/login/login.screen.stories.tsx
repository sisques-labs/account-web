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

// Rendered as if AdminShell redirected here from a guarded /admin/* route —
// a successful login should send the visitor back to `redirectTo` instead
// of the locale home.
export const WithRedirectTarget: Story = {
  args: {
    dict: enDict,
    lang: 'en',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/login',
        query: { redirectTo: '/en/admin/apps' },
      },
    },
  },
};
