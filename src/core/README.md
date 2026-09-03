# src/core — bounded contexts

`auth` (`src/core/auth/`) is the first bounded context and the canonical
example for every one after it — see [`src/core/auth/README.md`](./auth/README.md).
See `AGENTS.md` and `.claude/skills/architecture/SKILL.md` for the full
layer rules and naming conventions.

```
src/core/{context}/
├── domain/          pure TypeScript, zero framework imports
│   ├── interfaces/  DTOs / contracts
│   └── models/
├── application/
│   ├── use-cases/{name}/  one folder per use case
│   ├── ports/              repository interfaces
│   └── interfaces/         use-case input DTOs
├── infrastructure/
│   ├── repositories/graphql/  queries/, mutations/, {context}.gql.repository.ts
│   ├── repositories/rest/     REST-backed contexts (auth's convention) — no queries/mutations subfolders
│   └── store/                  Zustand stores
└── presentation/
    ├── screens/
    ├── hooks/       TanStack Query wrappers
    ├── providers/   {context}.providers.tsx — nest it into
    │                shared/presentation/providers/providers.tsx (only if the
    │                context actually needs one — auth doesn't)
    └── i18n/        en.ts + es.ts, wired into
                      shared/presentation/i18n/get-dictionary.ts
```
