import type { Locale } from './locale';
import type { WidenStringLiterals } from './widen-literals';
import type { ShellDict } from './shell/en';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';

import enShell from './shell/en';
import esShell from './shell/es';
import enAuth from '@/core/auth/presentation/i18n/en';
import esAuth from '@/core/auth/presentation/i18n/es';

export type AppDict = {
  shell: WidenStringLiterals<ShellDict>;
  auth: WidenStringLiterals<AuthDict>;
};

const dictionaries: Record<Locale, AppDict> = {
  en: {
    shell: enShell,
    auth: enAuth,
  },
  es: {
    shell: esShell,
    auth: esAuth,
  },
};

export function getDictionary(locale: Locale): AppDict {
  return dictionaries[locale];
}
