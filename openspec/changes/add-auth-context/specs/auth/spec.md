## Purpose

Lets a person create a Sisques Account and sign in to it from
`account-web`, establishing an authenticated session that the rest of the
app (and, later, other bounded contexts) can rely on.

## ADDED Requirements

### Requirement: User Registration
The system SHALL allow an unauthenticated visitor to register a new
Sisques Account by submitting email, password, and display name.

#### Scenario: Successful registration
- **GIVEN** a visitor on the registration screen with no existing account
  for their email
- **WHEN** they submit a valid email, password, and display name
- **THEN** the system creates the account and shows a confirmation that
  routes the visitor to the login screen (registration does not start an
  authenticated session)

#### Scenario: Registration with an already-registered email
- **GIVEN** a visitor whose email already has a Sisques Account
- **WHEN** they submit the registration form with that email
- **THEN** the system SHALL reject the submission and display an
  email-already-registered error without creating a duplicate account

#### Scenario: Registration with invalid input
- **GIVEN** a visitor on the registration screen
- **WHEN** they submit an invalid email or a password that fails the
  configured strength rules
- **THEN** the system SHALL block submission and show field-level
  validation errors without contacting the server

#### Scenario: Registration with no display name
- **GIVEN** a visitor on the registration screen
- **WHEN** they submit a valid email and password and leave the display
  name field empty
- **THEN** the system SHALL accept the submission (display name is
  optional) and proceed as in "Successful registration"

### Requirement: User Login
The system SHALL allow a registered user to authenticate with email and
password and establish a session.

#### Scenario: Successful login
- **GIVEN** a registered user on the login screen
- **WHEN** they submit correct email and password
- **THEN** the system SHALL establish an authenticated session (access
  token available to subsequent authenticated requests, refresh token
  persisted as an httpOnly cookie) and redirect the user to the
  post-login landing route

#### Scenario: Login with invalid credentials
- **GIVEN** a user on the login screen
- **WHEN** they submit an email/password combination that does not match
  any account, or a wrong password for an existing account
- **THEN** the system SHALL reject the submission, display an
  invalid-credentials error, and SHALL NOT establish a session

#### Scenario: Login with invalid input
- **GIVEN** a user on the login screen
- **WHEN** they submit an empty email or empty password
- **THEN** the system SHALL block submission and show field-level
  validation errors without contacting the server

### Requirement: Authenticated Session Persists Across Requests
Once a session is established, the system SHALL keep the user
authenticated for subsequent requests without requiring them to log in
again, until the session expires or is explicitly cleared.

#### Scenario: Authenticated request after login
- **GIVEN** a user who just logged in successfully
- **WHEN** the app makes a subsequent request that requires
  authentication
- **THEN** the request SHALL be sent as authenticated (carrying the
  current access token) without the user re-entering credentials

#### Scenario: Session cleared on unrecoverable auth failure
- **GIVEN** an authenticated user whose session can no longer be
  refreshed (e.g. the refresh token is invalid or expired)
- **WHEN** an authenticated request fails for that reason
- **THEN** the system SHALL clear the local session state and route the
  user back to the login screen

### Requirement: Localized Auth Screens
The registration and login screens SHALL be available in both supported
locales (English, Spanish) with no missing translation keys.

#### Scenario: Viewing auth screens in each supported locale
- **GIVEN** the app's supported locales (en, es)
- **WHEN** a visitor loads the registration or login screen under either
  locale segment
- **THEN** all visible text (labels, buttons, validation and error
  messages) SHALL render in that locale's language
