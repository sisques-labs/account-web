const dict = {
  welcome: {
    title: 'Next.js DDD template',
    description: 'No bounded contexts yet — add the first one under src/core/ to define the pattern.',
  },
  error: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while loading this page.',
    retry: 'Try again',
  },
} as const;

export default dict;
export type ShellDict = typeof dict;
