const dict = {
  welcome: {
    title: 'Next.js DDD template',
    description: 'No bounded contexts yet — add the first one under src/core/ to define the pattern.',
  },
} as const;

export default dict;
export type ShellDict = typeof dict;
