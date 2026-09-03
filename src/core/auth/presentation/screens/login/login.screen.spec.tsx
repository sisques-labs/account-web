import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError, AxiosHeaders } from 'axios';

vi.mock('@/core/auth/infrastructure/repositories/rest/auth.rest.repository', () => ({
  authRestRepository: { register: vi.fn(), login: vi.fn() },
}));
vi.mock('@/shared/infrastructure/store/session.store', () => ({
  useSessionStore: { getState: vi.fn() },
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

import { LoginScreen } from './login.screen';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import { useSessionStore } from '@/shared/infrastructure/store/session.store';
import enDict from '@/core/auth/presentation/i18n/en';

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginScreen dict={enDict} lang="en" />
    </QueryClientProvider>,
  );
}

function make401Error(): AxiosError {
  return new AxiosError(
    'Unauthorized',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    { status: 401, statusText: 'Unauthorized', headers: {}, config: { headers: new AxiosHeaders() }, data: {} },
  );
}

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSessionStore.getState).mockReturnValue({
      accessToken: null,
      setAccessToken: vi.fn(),
      clearAccessToken: vi.fn(),
      redirectToLogin: vi.fn(),
    });
  });

  it('renders email and password fields plus a submit button', () => {
    renderScreen();

    expect(screen.getByLabelText(enDict.login.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(enDict.login.password.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enDict.login.submit })).toBeInTheDocument();
  });

  it('renders a forgot-password link pointing at the localized route', () => {
    renderScreen();

    expect(screen.getByRole('link', { name: enDict.login.forgotPasswordLink })).toHaveAttribute(
      'href',
      '/en/forgot-password',
    );
  });

  it('blocks submission and shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: enDict.login.submit }));

    expect(await screen.findByText(enDict.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.getByText(enDict.validation.passwordRequired)).toBeInTheDocument();
    expect(authRestRepository.login).not.toHaveBeenCalled();
  });

  it('submits and redirects to the locale home on success', async () => {
    vi.mocked(authRestRepository.login).mockResolvedValue({ accessToken: 'access-tok' });
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.login.email.label), 'jane@example.com');
    await user.type(screen.getByLabelText(enDict.login.password.label), 'Sup3rStrongPassw0rd!');
    await user.click(screen.getByRole('button', { name: enDict.login.submit }));

    await waitFor(() =>
      expect(authRestRepository.login).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'Sup3rStrongPassw0rd!',
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/en'));
  });

  it('shows an invalid-credentials error on a 401 response and does not redirect', async () => {
    vi.mocked(authRestRepository.login).mockRejectedValue(make401Error());
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.login.email.label), 'jane@example.com');
    await user.type(screen.getByLabelText(enDict.login.password.label), 'wrong-password');
    await user.click(screen.getByRole('button', { name: enDict.login.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      enDict.login.errors.invalidCredentials,
    );
    expect(push).not.toHaveBeenCalled();
  });
});
