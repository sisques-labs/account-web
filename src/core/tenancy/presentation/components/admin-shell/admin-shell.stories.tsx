import type { Meta, StoryObj } from '@storybook/react';
import { AdminShell } from './admin-shell';
import enDict from '@/core/tenancy/presentation/i18n/en';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';

function base64UrlEncode(json: object): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(platformAdmin: boolean): string {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ sub: 'u1', email: 'admin@example.com', platformAdmin, tenants: [] });
  return `${header}.${body}.signature`;
}

const meta = {
  title: 'Tenancy/AdminShell',
  component: AdminShell,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ height: 500 }}><Story /></div>],
} satisfies Meta<typeof AdminShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlatformAdmin: Story = {
  parameters: { nextjs: { navigation: { pathname: '/en/admin/apps' } } },
  args: {
    lang: 'en',
    dict: enDict,
    children: <div>Page content</div>,
  },
  decorators: [
    (Story) => {
      useSessionStore.setState({ accessToken: makeToken(true), hasBootstrapped: true });
      return <Story />;
    },
  ],
};

export const Unauthorized: Story = {
  parameters: { nextjs: { navigation: { pathname: '/en/admin/apps' } } },
  args: {
    lang: 'en',
    dict: enDict,
    children: <div>Page content</div>,
  },
  decorators: [
    (Story) => {
      useSessionStore.setState({ accessToken: makeToken(false), hasBootstrapped: true });
      return <Story />;
    },
  ],
};

// The moment right after a hard reload, before the app-wide silent session
// bootstrap (see useSessionBootstrap) has resolved — AdminShell renders
// nothing rather than redirecting, so it doesn't bounce an already
// logged-in visitor while their session is still being restored.
export const Bootstrapping: Story = {
  parameters: { nextjs: { navigation: { pathname: '/en/admin/apps' } } },
  args: {
    lang: 'en',
    dict: enDict,
    children: <div>Page content</div>,
  },
  decorators: [
    (Story) => {
      useSessionStore.setState({ accessToken: null, hasBootstrapped: false });
      return <Story />;
    },
  ],
};
