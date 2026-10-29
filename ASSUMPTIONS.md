# Assumptions and Trade-offs

## Test Coverage

- The suite runs in Chromium, with the same tests executed in English and French. The signup URL determines the language (`/signup` or `/fr/signup`).
- For this exercise, I've included field, label, and accessible-name checks in Playwright. In a production environment, I'd typically cover more detailed validation, accessibility, and localization at the component level, while keeping E2E tests focused on critical user journeys.
- I've used the application's existing `data-testid` attributes for form interactions, while checking visible labels and accessible names separately.
- For negative scenarios, I've focused on validation behaviour rather than asserting exact error messages everywhere. I've kept exact wording for selected cases where it helps verify a specific validation rule. The invalid-email test also checks that no account-creation request was observed when the validation error appeared.
- I've kept the scope focused on signup and validation. Login navigation, the language toggle, and Terms/Privacy links are not covered separately.

## Test Data

- I've kept the test data simple, with fixed valid defaults and a unique email for each registration. Negative tests can override individual fields as needed. I'd consider Faker if more varied test data were required.
- The tests assume that the same phone number can be reused across accounts, since email is treated as the unique identifier.
- The assignment doesn't provide an account cleanup API, so test accounts remain in the QA environment. In a larger framework, I'd use APIs for test data setup and cleanup where available, reducing unnecessary UI interactions and keeping tests independent.

## Observed Application Behaviour

- Field validation errors appear when the user attempts to submit an invalid form, so the negative tests submit the form before checking the relevant error messages.
- Successful signup returns `201`, with the submitted account details in the response. The phone number includes the `+1` country code, and the response includes the selected language and consent value.
- After signup, English users are redirected to `/getaquote` and French users to `/getaquote/fr`. The French locale appears in a different position than on the signup URL (`/fr/signup`).
- The province is automatically selected based on geolocation, so I haven't included a required-field check for it in the empty-form test.
- Registering with an existing email returns `400` with a `bad format` error. I've kept the test aligned with this behaviour and documented the potentially misleading response in [BUGS.md](./BUGS.md).

## Execution

- The CI workflow is triggered manually to avoid creating unnecessary QA accounts.
- Playwright traces may contain credentials or authentication tokens. Generated reports and traces are excluded from Git and aren't uploaded as CI artifacts.
