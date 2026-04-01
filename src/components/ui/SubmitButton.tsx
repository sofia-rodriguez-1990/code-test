import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  /** Whether the form is currently submitting. Controls disabled state and spinner. */
  isSubmitting: boolean;
}

/**
 * Form submit button with a loading spinner state.
 * Displays "Register" normally, and "Registering..." with a spinning icon
 * while the form submission is in progress.
 */
export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="btn btn-primary w-100"
    >
      {isSubmitting ? (
        <span className="d-inline-flex align-items-center gap-2">
          <Loader2 className="spinner-border spinner-border-sm" aria-hidden="true" />
          Registering...
        </span>
      ) : (
        'Register'
      )}
    </button>
  );
}
