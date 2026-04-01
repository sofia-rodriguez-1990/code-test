import { z } from 'zod';

/**
 * Validates that a date string in YYYY-MM-DD format represents a real calendar date.
 * Catches edge cases like 2000-02-30 by reconstructing the date from its parts
 * and verifying the components match the original input.
 */
function isValidCalendarDate(value: string): boolean {
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    !isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

/**
 * Checks whether a YYYY-MM-DD date string falls strictly before today (UTC).
 * Used to ensure date of birth is in the past.
 */
function isDateInThePast(value: string): boolean {
  const [yearStr, monthStr, dayStr] = value.split('-');
  const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr)));

  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  return date < todayUtc;
}

/**
 * Zod schema for patient registration validation.
 *
 * Shared between the client (via React Hook Form's zodResolver) and the
 * server (via direct safeParse calls in the API route). This ensures that
 * validation rules are defined once and applied consistently.
 */
export const registrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' }),

  dateOfBirth: z
    .string()
    .trim()
    .min(1, { message: 'Date of birth is required' })
    .refine(isValidCalendarDate, { message: 'Date of birth must be a valid date' })
    .refine(isDateInThePast, { message: 'Date of birth must be in the past' }),

  reason: z
    .string()
    .trim()
    .min(1, { message: 'Reason for visit is required' })
    .refine((value) => value.trim().length >= 10, {
      message: 'Reason must be at least 10 characters',
    }),
});

/**
 * Inferred TypeScript type from the registration schema.
 * Useful for typing form values and function parameters.
 */
export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/**
 * Parses a registration payload using the Zod schema.
 * Returns either the validated data or a flat object of field-level errors.
 */
export function parseRegistration(data: unknown): {
  success: true;
  data: RegistrationFormValues;
} | {
  success: false;
  fieldErrors: Record<string, string>;
} {
  const result = registrationSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path[0] as string;
    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = issue.message;
    }
  }

  return { success: false, fieldErrors };
}
