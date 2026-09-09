# Cross-Domain Redirect Specification

## Purpose

Defines the validation contract for post-login redirect targets: same-origin
relative paths (existing, unchanged), allowlisted external origins (new), and
the ordered fallback chain `useLogin.hook.ts` uses to pick the final
destination. Exists so a consumer app on another allowlisted origin can be a
valid post-login destination without turning the login flow into an open
redirect.

## Requirements

### Requirement: Exact-Origin Allowlist Validation

The system SHALL parse a comma-separated list of trusted origins from a
single environment variable into an allowlist of origin strings. The system
SHALL treat a candidate URL's origin as trusted only when it is an **exact
string match** to one allowlist entry — never a suffix, prefix, or subdomain
match. An unset or empty environment variable SHALL produce an empty
allowlist (nothing is trusted).

#### Scenario: Exact match against the allowlist

- GIVEN the allowlist contains `https://app.sisqueslabs.com`
- WHEN a candidate URL's origin is exactly `https://app.sisqueslabs.com`
- THEN the origin SHALL be treated as trusted

#### Scenario: Subdomain of an allowlisted origin is rejected

- GIVEN the allowlist contains `https://sisqueslabs.com`
- WHEN a candidate URL's origin is `https://evil.sisqueslabs.com`
- THEN the origin SHALL NOT be treated as trusted, even though it shares the
  parent domain

#### Scenario: Unset or empty allowlist trusts nothing

- GIVEN the trusted-origins environment variable is unset or empty
- WHEN any candidate URL is validated
- THEN no origin SHALL be treated as trusted

#### Scenario: Malformed candidate URL

- GIVEN any non-empty allowlist
- WHEN the candidate string is not a parseable absolute URL
- THEN the origin SHALL NOT be treated as trusted

### Requirement: External Redirect Helper Contract

The system SHALL provide a new helper, parallel to and independent from the
existing same-origin path validator, that accepts a candidate redirect target
string and returns the validated absolute URL string when its origin exactly
matches an allowlist entry (per the Exact-Origin Allowlist Validation
requirement), or `null` otherwise. This helper MUST NOT change the existing
same-origin path validator's signature, behavior, or return values.

#### Scenario: Allowlisted external target validates

- GIVEN a candidate absolute URL whose origin is in the allowlist
- WHEN the helper validates it
- THEN it SHALL return that URL as a string, unchanged

#### Scenario: Non-allowlisted external target is rejected

- GIVEN a candidate absolute URL whose origin is not in the allowlist
- WHEN the helper validates it
- THEN it SHALL return `null`

#### Scenario: Malformed target does not throw

- GIVEN a candidate string that is not a parseable absolute URL
- WHEN the helper validates it
- THEN it SHALL return `null` without throwing

#### Scenario: Existing same-origin validator is unaffected

- GIVEN the existing same-origin path validator and its current test suite
- WHEN the new helper is introduced
- THEN the existing validator's behavior, signature, and passing tests SHALL
  remain unchanged

### Requirement: Login Redirect Selection Chain

On a successful login, the system SHALL select the redirect destination by
trying, in this exact order: (1) an internal same-origin relative path via
the existing same-origin path validator, (2) an external allowlisted origin
via the new helper, (3) the locale home route as fallback. The first
successful match in the chain SHALL be used; the system SHALL NOT proceed to
a later step once an earlier step succeeds.

#### Scenario: Internal same-origin redirect wins first

- GIVEN a successful login with a `redirectTo` that is a valid same-origin
  relative path
- WHEN the redirect destination is resolved
- THEN the system SHALL navigate to that internal path and SHALL NOT attempt
  external-allowlist validation

#### Scenario: External allowlisted redirect used when not internal

- GIVEN a successful login with a `redirectTo` that fails same-origin path
  validation but whose origin is in the external allowlist
- WHEN the redirect destination is resolved
- THEN the system SHALL navigate to that external allowlisted URL

#### Scenario: Non-allowlisted external target falls back to locale home

- GIVEN a successful login with `redirectTo` set to `https://evil.com/phishing`
- WHEN the redirect destination is resolved
- THEN neither the internal nor the external step SHALL match, and the
  system SHALL navigate to the current locale's home route

#### Scenario: Absent redirectTo falls back to locale home

- GIVEN a successful login with no `redirectTo` present
- WHEN the redirect destination is resolved
- THEN the system SHALL navigate to the current locale's home route

## Out of Scope

The following are intentionally absent from this capability, not missing
coverage:

- **OAuth-style `state`/CSRF nonce** on the redirect — no code or token rides
  this redirect, so that threat model does not apply here.
- **Login-CSRF mitigation** — a visitor tricked into authenticating as an
  attacker precedes any session and is unaddressed by either same-origin
  validation or the allowlist.
- **Trusted-destination phishing confirmation page** — an allowlisted
  `redirectTo` lending credibility to a phishing link is a pre-existing gap
  outside this capability's threat model.
- **`useAdminGuard.hook.ts`** — its producer contract stays same-origin-only
  and is unaffected by this capability.
