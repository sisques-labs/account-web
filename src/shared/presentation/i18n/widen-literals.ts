export type WidenStringLiterals<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? WidenStringLiterals<T[K]>
      : T[K];
};
