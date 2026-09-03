import { render, screen } from '@testing-library/react';
import { AdminUsersScreen } from './admin-users.screen';
import enDict from '@/core/tenancy/presentation/i18n/en';

describe('AdminUsersScreen', () => {
  it('renders the column headers and the not-available state', () => {
    render(<AdminUsersScreen dict={enDict} />);

    expect(screen.getByText(enDict.users.columns.user)).toBeInTheDocument();
    expect(screen.getByText(enDict.users.unavailable.title)).toBeInTheDocument();
    expect(screen.getByText(enDict.users.unavailable.description)).toBeInTheDocument();
  });
});
