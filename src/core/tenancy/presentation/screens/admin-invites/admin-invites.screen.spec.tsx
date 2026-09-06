import { render, screen } from '@testing-library/react';
import { AdminInvitesScreen } from './admin-invites.screen';
import enDict from '@/core/tenancy/presentation/i18n/en';

describe('AdminInvitesScreen', () => {
  it('renders the column headers and the not-available state', () => {
    render(<AdminInvitesScreen dict={enDict} />);

    expect(screen.getByText(enDict.invites.columns.email)).toBeInTheDocument();
    expect(screen.getByText(enDict.invites.unavailable.title)).toBeInTheDocument();
    expect(screen.getByText(enDict.invites.unavailable.description)).toBeInTheDocument();
  });
});
