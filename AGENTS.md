<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — nextjs-template

Sisques Labs Next.js frontend template — DDD + Hexagonal (Screaming
Architecture). This repository ships with the cross-cutting infrastructure
(`src/shared/`) already wired, but **no bounded contexts** (`src/core/`) yet.
The first context added defines the pattern every subsequent one follows —
see the `architecture` skill below.

## Stack

- Next.js 16 (App Router, Node server mode), React 19, TypeScript strict, pnpm@9.15.4
- State: Zustand (in-memory, no persistence)
- HTTP: Axios (Bearer token interceptor, 401 refresh mutex)
- GraphQL: Apollo Client v4 (`@apollo/client/react`)
- Server state / caching: TanStack Query v5
- Forms: React Hook Form + Zod
- UI: shadcn/ui (Radix UI + Tailwind v4) in `src/shared/presentation/components/ui/`
- Icons: lucide-react

## Architecture — DDD + Hexagonal (Screaming Architecture)

Bounded contexts under `src/core/{context}/`, each with 4 layers:

- **domain/** — pure TypeScript, zero framework imports. `interfaces/` (DTOs/contracts), `models/`
- **application/** — `use-cases/{name}/` one folder per use case, `ports/` (repository interfaces), `interfaces/` (use-case input DTOs). No framework imports; reads/writes store via `getState()` only.
- **infrastructure/** — `repositories/graphql/` (queries/, mutations/, `{context}.gql.repository.ts`), `store/` (Zustand)
- **presentation/** — `screens/`, `hooks/` (TanStack Query wrappers), `providers/`, `i18n/`

Cross-layer rules:
- domain never imports application/infrastructure/presentation
- application may import domain + infrastructure/store (via `getState()` only)
- infrastructure may import domain + shared http
- presentation may import application use-cases, infrastructure/store, domain interfaces

Providers: each module owns `presentation/providers/{context}.providers.tsx`; `shared/presentation/providers/providers.tsx` aggregates all of them. A new bounded context MUST nest its provider there — don't leave it wired loose.

## Shared infrastructure (already wired)

- `src/shared/infrastructure/http/` — `axios.client.ts` + `apollo.client.ts` (Bearer token, 401 refresh mutex via `refresh-mutex.ts`), `query.client.ts` (TanStack Query client), `proxy.ts` (Next.js route-handler passthrough to an upstream API)
- `src/shared/infrastructure/store/session.store.ts` — holds only the access token. It lives in `shared/` because the HTTP clients need it before any bounded context exists. The first `auth` context's login/refresh/logout use-cases should call `setAccessToken()`/`clearAccessToken()` on it; keep richer session data (current user, boot state) in that context's own store.
- `src/shared/presentation/components/ui/` — full shadcn/ui catalog (Radix + Tailwind v4), built on the design tokens in `src/design-system/`
- `src/shared/presentation/i18n/` — `locale.ts`, `get-dictionary.ts` (aggregator), `shell/` (chrome copy) — see i18n section below
- `src/shared/presentation/providers/providers.tsx` — provider aggregator

## Components

- Split a component into subcomponents / extract a hook when it **mixes responsibilities** (fetch + business logic + presentation) — this is qualitative, not a line-count threshold.
- Props: `interface {Name}Props` (extend `React.HTMLAttributes<HTMLElement>` when wrapping a DOM element); `ref` passed as a regular prop (React 19 ref-as-prop), never `forwardRef`.
- Named exports only (`export { Name }`) — no default exports.

## State management

Decision axis is **data origin**, not scope or convenience:

| Data origin | Tool |
|---|---|
| Server data (REST/GraphQL) | TanStack Query (`useQuery`/`useMutation`, wrapped in `presentation/hooks/`) |
| Client state shared across unrelated components/screens | Zustand store (`infrastructure/store/{name}.store.ts`) |
| State local to a single component/form | `useState`/`useReducer` |

Never mirror server data into Zustand — TanStack Query is the single source of truth for anything from the API. Never reach into a Zustand store for state only one component needs.

Any text search input whose value drives a network query (TanStack Query/GraphQL `findByCriteria`, etc.) MUST debounce the derived value before it reaches the query — never fire a request per keystroke. Use the shared `useDebouncedValue(value, delayMs = 300)` hook (`src/shared/presentation/hooks/use-debounced-value/`) inside the module's `use{Context}Filters` hook: keep the raw input state updating immediately (typing stays responsive) and derive the filter from the debounced value. Override `delayMs` only when 300 is demonstrably wrong. Purely client-side (in-memory) filtering with no network cost is exempt.

A repository's `create`/`update` mutation MUST NOT re-fetch the entity via `getById`/`findById` just to satisfy its return type when the mutation itself only returns a lightweight ack (`{ id, success, message }`) — that's a wasted network round trip whenever the caller only needs the id (e.g. to invalidate a query). Check every current `onSuccess` callback before assuming a caller needs more. Return `CreatedEntity` (`{ id: string }`, `shared/domain/interfaces/created-entity.interface.ts`) instead, built directly from the mutation's response.

## Naming conventions

- Use cases: `{name}.use-case.ts`, class `{Name}UseCase`, in `application/use-cases/{name}/`
- Repository ports: `{name}.repository.port.ts`
- GQL repositories: `infrastructure/repositories/graphql/{context}.gql.repository.ts` implementing `I{Context}Repository`, singleton export `{context}GqlRepository`; queries/mutations as one file per operation under `queries/`/`mutations/`
- Screens: `{name}.screen.tsx`, component `{Name}Screen` — no schemas or business logic inline
- Skeletons: `{name}-skeleton/{name}-skeleton.tsx`, exported `{Name}Skeleton`, used as `<Suspense fallback>` in `app/[lang]/…/page.tsx` — never inline
- Schemas: `{name}.schema.ts` (Zod + inferred type) in `presentation/schemas/`
- Hooks: `hooks/{hook-name}/{hookName}.hook.ts`, exported `use{Name}`
- Providers: `{context}.providers.tsx`
- Models/interfaces/VOs/entities: `{name}.model.ts` / `.interface.ts` / `.vo.ts` / `.entity.ts`
- Zustand stores: `{name}.store.ts` in `infrastructure/store/`
- Shared UI atoms: `{name}.tsx` (no suffix — shadcn atoms are self-describing)

No barrel `index.ts` files unless the module explicitly needs a public API surface.

## Testing — Strict TDD (mandatory)

- `pnpm test` — unit (Vitest + React Testing Library)
- `pnpm test:coverage` — coverage, enforced at an **80% threshold** (lines/functions/branches/statements) via `vitest.config.ts` → `test.coverage.thresholds`
- Integration and e2e (Playwright) not yet implemented
- `pnpm lint` / `pnpm tsc --noEmit` before considering work done
- Tests co-located as `.spec.ts`/`.test.tsx` next to source. Write RED first, then GREEN.
- GQL repositories are unit-tested by mocking `apolloClient` directly (`vi.mock`), not a live schema.
- Structural, logic-free files (enum declarations, provider wrappers that only compose JSX, thin client instantiation, the i18n dictionary aggregator) are excluded from coverage collection in `vitest.config.ts` → `test.coverage.exclude` rather than padding the threshold with untestable boilerplate. A guard clause that's unreachable under the jsdom test environment (e.g. an SSR `typeof window === 'undefined'` check) gets a `/* v8 ignore next */` comment instead of being left uncovered — don't chase coverage on it with fake environment overrides.

## Storybook (mandatory)

Every component under `src/shared/presentation/components/ui/` and
`src/core/{context}/presentation/components/`, and every screen under
`src/core/{context}/presentation/screens/`, MUST have a co-located
`{name}.stories.tsx`. Hook-backed components/screens seed the real
TanStack Query/Zustand state instead of mocking the hook module — see
`openspec/config.yaml` → `conventions.storybook` for the full pattern.

## i18n

- Custom TypeScript dictionaries (no external library, no JSON) — `as const`
- Per module: `src/core/{module}/presentation/i18n/en.ts` + `es.ts`, aggregated in `src/shared/presentation/i18n/get-dictionary.ts`
- `es.ts` uses `satisfies WidenStringLiterals<{Module}Dict>`
- Spanish variant: **Castellano de España** — tuteo, vocabulario peninsular. No voseo ni regionalismos latinoamericanos (note: this applies to product copy, not to conversational tone with the user).
- Every module needs an `i18n-parity.test.ts` validating both locales have the same keys
- Server component calls `getDictionary(locale)`, passes the dict slice as a prop to the client screen

## Git

- Base branch: `main`. Feature branches → PR → main.
- Conventional Commits, free scope. **No AI attribution in commit messages.**
- PRs capped at 400 lines — split into chained PRs if larger.

## Docker

- 2-stage build, `node:24-bookworm-slim` builder → runner
- Next.js `output: 'standalone'`; runner runs `node server.js` (no pnpm, no `next start`)
- Port 3000

## Registered Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| [architecture](.claude/skills/architecture/SKILL.md) | new context, add use-case/screen/repository, which layer, where does X go | DDD+Hexagonal layer rules, file naming, and coding conventions |

## Source of truth

Full detail (including SDD/OpenSpec workflow rules) lives in `openspec/config.yaml`. This file is a condensed, agent-facing summary — if they ever diverge, `openspec/config.yaml` wins.
