import type { Locale } from './locale';
import type { WidenStringLiterals } from './widen-literals';
import type { ShellDict } from './shell/en';

import enShell from './shell/en';
import esShell from './shell/es';

// Add one entry here per bounded context's presentation/i18n/en.ts, e.g.:
// import type { AuthDict } from '@/core/auth/presentation/i18n/en';
// import enAuth from '@/core/auth/presentation/i18n/en';
// import esAuth from '@/core/auth/presentation/i18n/es';

export type AppDict = {
  shell: WidenStringLiterals<ShellDict>;
};

const dictionaries: Record<Locale, AppDict> = {
  en: {
    shell: enShell,
  },
  es: {
    shell: esShell,
  },
};

export function getDictionary(locale: Locale): AppDict {
  return dictionaries[locale];
}
