# Changelog

All notable changes to this project will be documented in this file.
## [0.0.1] - 2026-09-09

### Bug Fixes
- **auth:** Type screen dict props as widened, matching get-dictionary (85c0132)
- **http:** Forward the refresh_token cookie into account-api's refresh body (b0a15eb)
- **auth:** Bootstrap session from the refresh cookie before gating routes redirect (2921f9e)
- **admin:** Cap admin screens content width at 1000px (46952aa)

### Chore
- Rename project from nextjs-template to account-web (5e743e6)

### Documentation
- **openspec:** Propose add-auth-context change (c95522c)
- **auth:** Document the auth context and REST repository convention (014e9a3)

### Features
- **auth:** Add domain and application layers (34519d7)
- **auth:** Add REST repository, schemas, and mutation hooks (85cba5e)
- **auth:** Add register/login screens, stories, and i18n (b62d906)
- **auth:** Wire register/login routes into the app router (5e24e23)
- **design-system:** Repaint theme to Sisques Account blue/slate/Inter identity (95b0f7c)
- **tenancy:** Add tenancy bounded context and admin apps/tenant sections (6b46df6)
- **auth:** Restyle login/register with logomark and add forgot-password screen (4fa22e9)
- **admin:** Redirect unauthenticated visitors to login instead of a bare notice (316ea5b)
- **admin:** Add create-app action and fix admin shell layout issues (9f3dfba)
- **brand:** Replace favicon with Sisques Account logomark (0c49b51)
- **tenancy:** Move admin apps/app-detail loading and errors to Suspense (b7f5c7f)

### Refactor
- **tenancy:** Split App aggregate into its own bounded context (b465c8e)
- **auth:** Derive login/register error messages inside their hooks (af407e4)
- **tenancy:** Extract admin route guard into useAdminGuard hook (b520e63)
- **auth:** Move login redirect and register normalization into hooks (7482aae)
- **app:** Extract create-app-dialog orchestration into a hook (2a7b02a)
- **tenancy:** Extract create-tenant-dialog orchestration into a hook (f79019b)
- **shared:** Extract getAxiosErrorMessage from useLogin/useRegister (6651e8e)
- **tenancy:** Replace admin top-bar Context with a Zustand store (ca0761b)

