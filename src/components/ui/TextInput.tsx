import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text for the input field. */
  label: string;
  /** Validation error message to display below the input. */
  error?: string;
}

/**
 * Accessible text input with label and error display.
 * Designed to receive spread props from React Hook Form's `register()`.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ label, error, id, ...rest }, ref) {
    const errorId = `${id}-error`;

    return (
      <div className="mb-3">
        <label
          htmlFor={id}
          className="form-label"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type="text"
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
