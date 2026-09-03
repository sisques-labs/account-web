const dict = {
  admin: {
    nav: {
      apps: 'Ecosystem apps',
      users: 'Platform users',
      invites: 'Pending invites',
    },
    unauthorized: {
      title: 'Not authorized',
      description: "You don't have platform admin access to this section.",
    },
  },
  appDetail: {
    columns: {
      tenant: 'Tenant',
      members: 'Members',
      created: 'Created',
    },
    viewMembers: 'View members',
    createTenant: 'Create tenant',
    loading: 'Loading tenants…',
    empty: {
      title: 'No tenants yet',
      description: 'Tenants created for this app will show up here.',
    },
    error: 'Could not load tenants. Please try again.',
  },
  createTenantDialog: {
    title: 'New tenant',
    description: 'You will become this tenant’s owner.',
    name: { label: 'Tenant name', placeholder: 'E.g. Casa de Marta' },
    submit: 'Create tenant',
    submitting: 'Creating tenant…',
    errors: { generic: 'Something went wrong. Please try again.' },
  },
  membersDialog: {
    title: 'Members of {name}',
    loading: 'Loading members…',
    empty: 'No members yet.',
    userIdLabel: 'User',
    addMember: {
      title: 'Add member',
      email: { label: 'Email', placeholder: 'person@example.com' },
      role: { label: 'Role' },
      submit: 'Add member',
      submitting: 'Adding…',
      errors: {
        generic: 'Something went wrong. Please try again.',
      },
    },
  },
  roles: {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    MEMBER: 'Member',
  },
  users: {
    title: 'Platform users',
    columns: { user: 'User', platformAdmin: 'Platform admin', tenants: 'Tenants', since: 'Since' },
    unavailable: {
      title: 'This section is not available yet',
      description: 'account-api does not expose a platform-wide user listing yet.',
    },
  },
  invites: {
    title: 'Pending invites',
    columns: { email: 'Email', tenant: 'Tenant', role: 'Role', invitedBy: 'Invited by', expires: 'Expires' },
    unavailable: {
      title: 'This section is not available yet',
      description: 'account-api does not implement tenant invites yet.',
    },
  },
  validation: {
    nameRequired: 'Enter a tenant name.',
    emailInvalid: 'Enter a valid email address.',
    roleRequired: 'Select a role.',
  },
} as const;

export default dict;
export type TenancyDict = typeof dict;
