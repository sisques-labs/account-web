const dict = {
  register: {
    title: 'Create your account',
    description: 'Sign up for a Sisques Account to get started.',
    email: { label: 'Email', placeholder: 'you@example.com' },
    password: { label: 'Password', placeholder: 'At least 8 characters' },
    displayName: { label: 'Display name (optional)', placeholder: 'Jane Doe' },
    submit: 'Create account',
    submitting: 'Creating account…',
    errors: {
      emailAlreadyRegistered: 'This email is already registered. Try logging in instead.',
      generic: 'Something went wrong. Please try again.',
    },
    loginLink: 'Already have an account? Log in',
  },
  login: {
    title: 'Log in',
    description: 'Welcome back to Sisques Account.',
    email: { label: 'Email', placeholder: 'you@example.com' },
    password: { label: 'Password', placeholder: 'Your password' },
    submit: 'Log in',
    submitting: 'Logging in…',
    errors: {
      invalidCredentials: 'Incorrect email or password.',
      generic: 'Something went wrong. Please try again.',
    },
    registerLink: "Don't have an account? Sign up",
    forgotPasswordLink: 'Forgot your password?',
  },
  forgotPassword: {
    title: 'Reset your password',
    description: "We'll send you a link to reset it.",
    email: { label: 'Email', placeholder: 'you@example.com' },
    submit: 'Send reset link',
    unavailable: 'This feature is not available yet.',
    backToLoginLink: 'Back to log in',
  },
  validation: {
    emailInvalid: 'Enter a valid email address.',
    passwordTooShort: 'Password must be at least 8 characters.',
    passwordRequired: 'Enter your password.',
  },
} as const;

export default dict;
export type AuthDict = typeof dict;
