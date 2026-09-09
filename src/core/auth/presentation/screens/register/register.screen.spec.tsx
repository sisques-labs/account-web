import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError, AxiosHeaders } from 'axios';

vi.mock('@/core/auth/infrastructure/repositories/rest/auth.rest.repository', () => ({
  authRestRepository: { register: vi.fn(), login: vi.fn() },
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

import { RegisterScreen } from './register.screen';
import { authRestRepository } from '@/core/auth/infrastructure/repositories/rest/auth.rest.repository';
import enDict from '@/core/auth/presentation/i18n/en';

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <RegisterScreen dict={enDict} lang="en" />
    </QueryClientProvider>,
  );
}

function make409Error(): AxiosError {
  return new AxiosError(
    'Conflict',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    { status: 409, statusText: 'Conflict', headers: {}, config: { headers: new AxiosHeaders() }, data: {} },
  );
}

describe('RegisterScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password, and display name fields plus a submit button', () => {
    renderScreen();

    expect(screen.getByLabelText(enDict.register.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(enDict.register.password.label)).toBeInTheDocument();
    expect(screen.getByLabelText(enDict.register.displayName.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enDict.register.submit })).toBeInTheDocument();
  });

  it('blocks submission and shows validation errors for invalid email and a short password', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.register.email.label), 'not-an-email');
    await user.type(screen.getByLabelText(enDict.register.password.label), 'short');
    await user.click(screen.getByRole('button', { name: enDict.register.submit }));

    expect(await screen.findByText(enDict.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.getByText(enDict.validation.passwordTooShort)).toBeInTheDocument();
    expect(authRestRepository.register).not.toHaveBeenCalled();
  });

  it('submits with no display name and redirects to login on success', async () => {
    vi.mocked(authRestRepository.register).mockResolvedValue({ id: 'user-1' });
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.register.email.label), 'jane@example.com');
    await user.type(screen.getByLabelText(enDict.register.password.label), 'Sup3rStrongPassw0rd!');
    await user.click(screen.getByRole('button', { name: enDict.register.submit }));

    await waitFor(() =>
      expect(authRestRepository.register).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'Sup3rStrongPassw0rd!',
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/en/login'));
  });

  it('shows an email-already-registered error on a 409 response and does not redirect', async () => {
    vi.mocked(authRestRepository.register).mockRejectedValue(make409Error());
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.register.email.label), 'jane@example.com');
    await user.type(screen.getByLabelText(enDict.register.password.label), 'Sup3rStrongPassw0rd!');
    await user.click(screen.getByRole('button', { name: enDict.register.submit }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      enDict.register.errors.emailAlreadyRegistered,
    );
    expect(push).not.toHaveBeenCalled();
  });
});
