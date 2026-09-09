import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/shared/infrastructure/http/axios.client', () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { ForgotPasswordScreen } from './forgot-password.screen';
import { http } from '@/shared/infrastructure/http/axios.client';
import enDict from '@/core/auth/presentation/i18n/en';

function renderScreen() {
  return render(<ForgotPasswordScreen dict={enDict} lang="en" />);
}

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email field and submit button', () => {
    renderScreen();

    expect(screen.getByLabelText(enDict.forgotPassword.email.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enDict.forgotPassword.submit })).toBeInTheDocument();
  });

  it('blocks submission and shows a validation error for an invalid email', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.forgotPassword.email.label), 'not-an-email');
    await user.click(screen.getByRole('button', { name: enDict.forgotPassword.submit }));

    expect(await screen.findByText(enDict.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.queryByText(enDict.forgotPassword.unavailable)).not.toBeInTheDocument();
  });

  it('shows the "not available" message for a valid email, without making any network request', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByLabelText(enDict.forgotPassword.email.label), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: enDict.forgotPassword.submit }));

    expect(await screen.findByText(enDict.forgotPassword.unavailable)).toBeInTheDocument();
    expect(screen.queryByLabelText(enDict.forgotPassword.email.label)).not.toBeInTheDocument();
    expect(http.get).not.toHaveBeenCalled();
    expect(http.post).not.toHaveBeenCalled();
    expect(http.put).not.toHaveBeenCalled();
    expect(http.patch).not.toHaveBeenCalled();
    expect(http.delete).not.toHaveBeenCalled();
  });

  it('links back to login', () => {
    renderScreen();

    expect(screen.getByRole('link', { name: enDict.forgotPassword.backToLoginLink })).toHaveAttribute(
      'href',
      '/en/login',
    );
  });
});
