import type { Meta, StoryObj } from '@storybook/react';
import { RegisterScreen } from './register.screen';
import enDict from '@/core/auth/presentation/i18n/en';

const meta = {
  title: 'Screens/Register',
  component: RegisterScreen,
  tags: ['autodocs'],
} satisfies Meta<typeof RegisterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dict: enDict,
    lang: 'en',
  },
};
