# ER CareView - Patient Registration

Patient registration form for the ER CareView dashboard. Built with Next.js + React + TypeScript + Bootstrap (dark mode) as part of the Sync Technologies Senior Full-Stack Engineer assessment (Option C).

## Setup

### NOTE: REQUIRES NODE v22+ - this repo is using asdf

1. asdf install on root
2. asdf local nodejs <version fropm .tool-versions>

```
npm install
npm run dev
```

Go to http://localhost:3000 and it redirects to the registration form.

To build for production: `npm run build`

Needs Node 18+.

## How it works

The form collects first name, last name, date of birth, and reason for visit. Validation is handled by a Zod schema that's shared between the frontend and the API route so they stay in sync.

On the client side, React Hook Form uses the schema via `zodResolver` with `mode: 'onBlur'` so errors show up when you tab out of a field. On submit, TanStack Query's `useMutation` handles the API call and manages loading/error/success states.

The API route (`POST /api/registrations`) validates the same schema server-side and returns either the validated data (200) or field-level errors (422). There's no database — it just echoes back the data. That's intentional for the scope of this assessment.

## Project structure

- `src/components/ui/` — Individual form components (TextInput, TextArea, DateInput, SubmitButton, SuccessCard)
- `src/components/registration/RegistrationForm.tsx` — Main form that ties everything together
- `src/lib/validation/registrationSchema.ts` — The shared Zod schema
- `src/types/registration.ts` — TypeScript types
- `src/app/api/registrations/route.ts` — API endpoint

## Validation rules

- First/last name: required, trimmed
- Date of birth: required, has to be a real date (no Feb 30th), has to be in the past
- Reason for visit: required, at least 10 characters after trimming

## Accessibility

Inputs have proper labels, error messages use `role="alert"`, inputs are linked to errors with `aria-describedby`, and the success card gets focus after submission so screen readers pick it up. The form uses `noValidate` so browser validation doesn't get in the way.

## Tests

```
npm test
```

Three groups:
- Schema validation tests (6 tests) — checks the Zod schema directly
- Component tests (6 tests) — renders the form with Testing Library and simulates user interaction
- API route tests (3 tests) — calls the handler with mock requests

## What next?

There are many things that can be done next and I'd like to have a conversation instead of listing everything here. Here are some examples:

- E2E tests with Playwright/Selenium
- Better date picker
- Error boundary around the form
- i18n support
- CI pipeline with GitHub Actions
