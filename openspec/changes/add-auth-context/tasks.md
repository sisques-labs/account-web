## 1. Shared infra: fix the placeholder auth paths (Decision 1)

- [ ] 1.1 Update `AUTH_SKIP` in `src/shared/infrastructure/http/axios.client.ts` from `/auth/login`/`/auth/register` to `/v1/auth/login`/`/v1/auth/register`, and update `doRefresh()`'s call from `/auth/refresh` to `/v1/auth/refresh`; verify `pnpm test src/shared/infrastructure/http/axios.client.spec.ts` and `refresh-mutex.spec.ts` still pass (update any path literals asserted in those specs)
- [ ] 1.2 Manually confirm against a running `account-api` (via `local-dev-stack`) that `POST /api/v1/auth/register`'s response body is a bare string (per design.md Risk 1) — note the actual shape for task 4.2

## 2. Domain layer (`src/core/auth/domain/`)

- [ ] 2.1 Add `interfaces/register-input.interface.ts` (`email`, `password`, `displayName?`) and `interfaces/login-input.interface.ts` (`email`, `password`), matching `account-api`'s `RegisterUserDto`/`LoginUserDto` field names exactly

## 3. Application layer (`src/core/auth/application/`)

- [ ] 3.1 Write failing spec for `ports/auth.repository.port.ts` consumers: define `IAuthRepository` with `register(input: RegisterInput): Promise<CreatedEntity>` and `login(input: LoginInput): Promise<{ accessToken: string }>` (no `refreshToken` in the return type — Decision 3)
- [ ] 3.2 RED: write `register.use-case.spec.ts` for `RegisterUseCase` (mocked `IAuthRepository`) asserting it calls `repository.register(input)` and returns its `CreatedEntity` result; GREEN: implement `application/use-cases/register/register.use-case.ts`
- [ ] 3.3 RED: write `login.use-case.spec.ts` for `LoginUseCase` (mocked `IAuthRepository` + mocked `useSessionStore`) asserting a successful call invokes `useSessionStore.getState().setAccessToken(accessToken)` (Decision 4) and returns the result, and a rejected repository call propagates the error without touching the store; GREEN: implement `application/use-cases/login/login.use-case.ts`

## 4. Infrastructure layer — REST repository convention (`src/core/auth/infrastructure/repositories/rest/`)

- [ ] 4.1 RED: write `auth.rest.repository.spec.ts` mocking the shared `http` axios instance (`vi.mock('@/shared/infrastructure/http/axios.client')`), covering: `register()` posts to `/v1/auth/register` and maps the response to `CreatedEntity`; `login()` posts to `/v1/auth/login` and returns only `{ accessToken }`, discarding `refreshToken` from the response body (Decision 3); both propagate a rejected promise on non-2xx
- [ ] 4.2 GREEN: implement `auth.rest.repository.ts` (`class AuthRestRepository implements IAuthRepository`, singleton export `authRestRepository`), using the response shape confirmed in task 1.2 for `register()`

## 5. Presentation — schemas + hooks

- [ ] 5.1 Add `presentation/schemas/register.schema.ts` (Zod: valid email, password min 8 chars, displayName optional non-empty-if-present) and `presentation/schemas/login.schema.ts` (valid email, non-empty password), each exporting the schema + inferred type
- [ ] 5.2 RED: write `use-register.hook.spec.ts` / `use-login.hook.spec.ts` (React Testing Library + a fresh `QueryClient`) asserting each hook wraps `useMutation`, calls the corresponding use-case, and surfaces `isPending`/`isError`/`error` state; GREEN: implement `presentation/hooks/use-register/useRegister.hook.ts` and `presentation/hooks/use-login/useLogin.hook.ts`

## 6. Presentation — screens + stories

- [ ] 6.1 RED: write `register.screen.spec.tsx` covering: renders the three fields; blocks submit and shows validation errors on invalid input without calling the mutation (spec: "Registration with invalid input"); on submit success, redirects to the login route (spec: "Successful registration"); on a 409-shaped error, shows an email-already-registered message (spec: "Registration with an already-registered email"). GREEN: implement `presentation/screens/register/register.screen.tsx` (`RegisterScreen`, React Hook Form + `register.schema.ts` + `useRegister`)
- [ ] 6.2 RED: write `login.screen.spec.tsx` covering the same shape for login (empty-field validation, invalid-credentials error display, successful-login redirect to `/[lang]` per Decision 6); GREEN: implement `presentation/screens/login/login.screen.tsx` (`LoginScreen`)
- [ ] 6.3 Add `register.screen.stories.tsx` and `login.screen.stories.tsx`, seeding the real `useMutation` via a decorator-provided `QueryClient` per the project's hook-backed-story convention (no mocking the hook module); verify `pnpm storybook build` succeeds and both stories render

## 7. i18n

- [ ] 7.1 Add `presentation/i18n/en.ts` and `presentation/i18n/es.ts` (Castellano de España — tuteo, vocabulario peninsular) covering every label/button/validation/error string used by both screens; `es.ts` uses `satisfies WidenStringLiterals<AuthDict>`
- [ ] 7.2 Add `i18n-parity.test.ts` asserting `en.ts` and `es.ts` expose identical key sets; register both dicts in `src/shared/presentation/i18n/get-dictionary.ts`'s `AppDict`/`dictionaries`; verify the parity test and `pnpm test` pass

## 8. Routes

- [ ] 8.1 Add `app/[lang]/register/page.tsx` (server component: `getDictionary(lang)` → passes the auth dict slice to `<RegisterScreen>`) and `app/[lang]/login/page.tsx` (same pattern for `<LoginScreen>`); verify both routes render in dev (`pnpm dev`, visit `/en/register` and `/en/login`)

## 9. Documentation

- [ ] 9.1 Add `src/core/auth/README.md` documenting the context's scope, the REST repository convention (Decision 2), and the refresh-token handling decision (Decision 3), following the pattern the architecture skill expects from the first context
- [ ] 9.2 Update `src/core/README.md` to reference `src/core/auth/README.md` as the canonical example, replacing the "no bounded contexts yet" placeholder
- [ ] 9.3 Update `openspec/config.yaml`'s `conventions.naming.repositories` and `conventions.structure` to document the new REST repository pattern alongside the existing GQL one (mirroring the `gql_repos` block with an equivalent `rest_repos` block)

## 10. Verification

- [ ] 10.1 Run `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test:coverage` (≥80% lines/functions/branches/statements) and confirm all pass
- [ ] 10.2 Run `pnpm build` to confirm the new routes compile cleanly in a production build
- [ ] 10.3 Re-read `openspec/changes/add-auth-context/specs/auth/spec.md` against the implemented screens and confirm every scenario is covered by a test from tasks 6.1/6.2 (traceability pass, no new code expected)
- [ ] 10.4 If the full diff exceeds the 400-line PR cap, split into chained PRs along the phase boundaries above (e.g. PR1: tasks 1–4 infra/domain/application, PR2: tasks 5–8 presentation/routes, PR3: tasks 9–10 docs/verification) per `openspec/config.yaml`'s `tasks` rules
