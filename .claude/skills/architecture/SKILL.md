---
name: architecture
description: "Trigger: new context, add use-case/screen/repository, which layer, where does X go. Enforce DDD+Hexagonal layer rules and file naming for frontends built from this template."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Apply this skill whenever creating or modifying any file under `src/core/` or `src/shared/`.

## Hard Rules

1. **domain/ never imports application/, infrastructure/, or presentation/.** Pure TypeScript, zero framework imports.
2. **application/ reads/writes store state via `getState()` only** — never via a React hook (`useXStore()`) inside a use-case.
3. **Repository ports live in `application/ports/`; implementations in `infrastructure/repositories/`.** Domain and application depend on the port interface, never on the concrete GQL/HTTP class.
4. **New bounded context → wire its provider, don't leave it loose.** Add `{context}.providers.tsx` and nest it inside `shared/presentation/providers/providers.tsx`.
5. **New bounded context → wire its i18n, don't leave it loose.** Add `presentation/i18n/en.ts` + `es.ts` and register both in `shared/presentation/i18n/get-dictionary.ts`'s `AppDict`/`dictionaries`.
6. **No barrel `index.ts` files** unless the module explicitly needs a public API surface.
7. **Named exports only** (`export { Name }`) — no default exports on components/hooks/classes.
8. **`ref` is a regular prop** (React 19 ref-as-prop) — never `forwardRef`.
9. **Debounce any text input that drives a network query.** Use the shared `useDebouncedValue(value, delayMs = 300)` hook inside the module's `use{Context}Filters` hook — never fire a request per keystroke.
10. **A create/update mutation that only returns a lightweight ack must not re-fetch the entity.** Return `CreatedEntity` (`shared/domain/interfaces/created-entity.interface.ts`) built from the mutation response instead of chaining a `getById`.

## Bounded Context Structure

```
src/core/{context}/
├── domain/
│   ├── interfaces/        {name}.interface.ts       — DTOs / contracts
│   ├── models/             {name}.model.ts
│   ├── enums/               {name}.enum.ts
│   └── value-objects/      {name}.vo.ts               — immutable, validate in constructor
├── application/
│   ├── use-cases/{name}/  {name}.use-case.ts, class {Name}UseCase — one folder per use case
│   ├── ports/               {name}.repository.port.ts
│   └── interfaces/         use-case input DTOs
├── infrastructure/
│   ├── repositories/graphql/
│   │   ├── queries/         {operation}.query.ts       — gql`` document, named export
│   │   ├── mutations/      {operation}.mutation.ts    — gql`` document, named export
│   │   ├── {context}.gql.repository.ts   — implements I{Context}Repository, singleton export {context}GqlRepository
│   │   └── {context}.gql.repository.spec.ts — mock apolloClient directly (vi.mock), not a live schema
│   └── store/               {name}.store.ts (Zustand) — framework-coupled, lives here not in application
└── presentation/
    ├── screens/{name}/     {name}.screen.tsx, component {Name}Screen — no schemas/business logic inline
    ├── hooks/{hook-name}/  {hookName}.hook.ts, exported use{Name} — wraps TanStack Query
    ├── schemas/             {name}.schema.ts — Zod schema + inferred type
    ├── components/          feature components + co-located {name}-skeleton/{name}-skeleton.tsx
    ├── providers/           {context}.providers.tsx
    └── i18n/                en.ts + es.ts + i18n-parity.spec.ts
```

## Decision Gates

| Question | Answer |
|----------|--------|
| Where does business logic live? | `application/use-cases/{name}/` — one class per use case |
| Where does server-state fetching live? | `presentation/hooks/` — TanStack Query `useQuery`/`useMutation`, never called from a screen directly without a hook wrapper |
| Where does GraphQL/HTTP wiring live? | `infrastructure/repositories/` — screens and use-cases depend on the port, never the concrete repository |
| Client state shared across screens? | `infrastructure/store/{name}.store.ts` (Zustand) |
| State local to one component? | `useState`/`useReducer` inside the component — never promoted to a store |
| Cross-cutting utilities (http, i18n, ui atoms)? | `src/shared/` |
| Where do I register a new context's provider? | `shared/presentation/providers/providers.tsx` |
| Where do I register a new context's dictionary? | `shared/presentation/i18n/get-dictionary.ts` |

## State Management — data origin decides the tool

| Data origin | Tool |
|---|---|
| Server data (REST/GraphQL) | TanStack Query (`useQuery`/`useMutation`, wrapped in `presentation/hooks/`) |
| Client state shared across unrelated components/screens | Zustand store (`infrastructure/store/{name}.store.ts`) |
| State local to a single component/form | `useState`/`useReducer` |

Never mirror server data into Zustand. Never reach into a Zustand store for state only one component needs.

## Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Use case | `{name}.use-case.ts`, class `{Name}UseCase` | `login.use-case.ts`, `LoginUseCase` |
| Repository port | `{name}.repository.port.ts` | `auth.repository.port.ts` |
| GQL repository | `{context}.gql.repository.ts`, class `{Context}GqlRepository` | `auth.gql.repository.ts` |
| Screen | `{name}.screen.tsx`, component `{Name}Screen` | `login.screen.tsx`, `LoginScreen` |
| Skeleton | `{name}-skeleton/{name}-skeleton.tsx`, exported `{Name}Skeleton` | `login-skeleton/login-skeleton.tsx` |
| Schema | `{name}.schema.ts` (Zod + inferred type) | `login.schema.ts` |
| Hook | `hooks/{hook-name}/{hookName}.hook.ts`, exported `use{Name}` | `use-login/useLogin.hook.ts` |
| Provider | `{context}.providers.tsx` | `auth.providers.tsx` |
| Model / interface / VO / entity | `{name}.model.ts` / `.interface.ts` / `.vo.ts` / `.entity.ts` | `account-user.model.ts` |
| Zustand store | `{name}.store.ts` in `infrastructure/store/` | `auth.store.ts` |
| Shared UI atom | `{name}.tsx` (no suffix — shadcn atoms are self-describing) | `button.tsx` |

## References

- `src/core/README.md` — bounded context layout, updated once the first context lands
- `src/shared/` — cross-cutting infra already wired: `infrastructure/http/` (axios + Apollo clients, 401 refresh mutex), `infrastructure/store/session.store.ts` (access token only), `presentation/providers/`, `presentation/i18n/`, `presentation/components/ui/` (shadcn catalog)
- Once the first bounded context exists, add its `README.md` at `src/core/{context}/README.md` and reference it here as the canonical example for the next context.
