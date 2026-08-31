# src/core — bounded contexts

No bounded contexts yet. This is a fresh frontend template; the first
context you add here defines the pattern every subsequent one follows.
See `AGENTS.md` and `.claude/skills/architecture/SKILL.md` for the layer
rules and naming conventions to apply.

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
│   └── store/                  Zustand stores
└── presentation/
    ├── screens/
    ├── hooks/       TanStack Query wrappers
    ├── providers/   {context}.providers.tsx — nest it into
    │                shared/presentation/providers/providers.tsx
    └── i18n/        en.ts + es.ts, wired into
                      shared/presentation/i18n/get-dictionary.ts
```
