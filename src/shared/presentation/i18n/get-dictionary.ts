import type { Locale } from './locale';
import type { WidenStringLiterals } from './widen-literals';
import type { ShellDict } from './shell/en';
import type { AuthDict } from '@/core/auth/presentation/i18n/en';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
// Aliased: the `app` bounded context's own dict type is also named
// `AppDict` — this file's aggregator type of the same name predates that
// context and combines every module's dict, not just `app`'s.
import type { AppDict as AppContextDict } from '@/core/app/presentation/i18n/en';

import enShell from './shell/en';
import esShell from './shell/es';
import enAuth from '@/core/auth/presentation/i18n/en';
import esAuth from '@/core/auth/presentation/i18n/es';
import enTenancy from '@/core/tenancy/presentation/i18n/en';
import esTenancy from '@/core/tenancy/presentation/i18n/es';
import enApp from '@/core/app/presentation/i18n/en';
import esApp from '@/core/app/presentation/i18n/es';

export type AppDict = {
  shell: WidenStringLiterals<ShellDict>;
  auth: WidenStringLiterals<AuthDict>;
  tenancy: WidenStringLiterals<TenancyDict>;
  app: WidenStringLiterals<AppContextDict>;
};

const dictionaries: Record<Locale, AppDict> = {
  en: {
    shell: enShell,
    auth: enAuth,
    tenancy: enTenancy,
    app: enApp,
  },
  es: {
    shell: esShell,
    auth: esAuth,
    tenancy: esTenancy,
    app: esApp,
  },
};

export function getDictionary(locale: Locale): AppDict {
  return dictionaries[locale];
}
