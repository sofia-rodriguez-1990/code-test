import { forwardRef } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessCardProps {
  /** The patient's first name, displayed in the confirmation message. */
  firstName: string;
}

/**
 * Confirmation card shown after a successful registration.
 * Uses role="status" and aria-live="polite" so screen readers announce the
 * success message. Accepts a ref for focus management after form submission.
 */
export const SuccessCard = forwardRef<HTMLDivElement, SuccessCardProps>(
  function SuccessCard({ firstName }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="card border-success text-center p-4 shadow"
      >
        <CheckCircle
          className="mx-auto mb-3 text-success"
          style={{ width: '3rem', height: '3rem' }}
          aria-hidden="true"
        />
        <h2 className="h5 fw-semibold text-success">
          Registration submitted
        </h2>
        <p className="mt-2 text-success-emphasis">
          Thank you, {firstName}. Your registration has been received.
        </p>
      </div>
    );
  }
);
