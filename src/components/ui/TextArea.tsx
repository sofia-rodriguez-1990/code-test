import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label text for the textarea field. */
  label: string;
  /** Validation error message to display below the textarea. */
  error?: string;
}

/**
 * Accessible textarea with label and error display.
 * Designed to receive spread props from React Hook Form's `register()`.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, id, ...rest }, ref) {
    const errorId = `${id}-error`;

    return (
      <div className="mb-3">
        <label
          htmlFor={id}
          className="form-label"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={`form-control${error ? ' is-invalid' : ''}`}
          {...rest}
        />
        {error && (
          <span
            id={errorId}
            role="alert"
            aria-live="polite"
            className="invalid-feedback d-block"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);
