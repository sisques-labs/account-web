const dict = {
  apps: {
    title: 'Ecosystem apps',
    createApp: 'Create app',
    connected: 'Connected',
    tenantsLabel: 'tenants',
    usersLabel: 'users',
    viewTenants: 'View tenants →',
    loading: 'Loading apps…',
    empty: {
      title: 'No apps yet',
      description: 'Apps created in account-api will show up here.',
    },
  },
  createAppDialog: {
    title: 'New app',
    description: 'Register a new app in the Sisqués Labs ecosystem.',
    name: { label: 'App name', placeholder: 'E.g. Gardenia' },
    submit: 'Create app',
    submitting: 'Creating app…',
    errors: { generic: 'Something went wrong. Please try again.' },
  },
  validation: {
    nameRequired: 'Enter an app name.',
  },
} as const;

export default dict;
export type AppDict = typeof dict;
