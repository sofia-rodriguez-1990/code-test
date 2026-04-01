/**
 * Payload shape for patient registration submissions.
 * Used by both client-side forms and server-side API validation.
 */
export interface RegistrationPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  reason: string;
}

/**
 * Per-field error messages returned when validation fails.
 * Each key corresponds to a field in RegistrationPayload.
 */
export interface FieldErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  reason?: string;
}

/**
 * Successful API response shape.
 */
export interface ApiSuccessResponse {
  success: true;
  data: RegistrationPayload;
}

/**
 * Error API response shape, returned with HTTP 422.
 */
export interface ApiErrorResponse {
  success: false;
  fieldErrors: FieldErrors;
}

/**
 * Union type covering both possible API response shapes.
 */
export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
