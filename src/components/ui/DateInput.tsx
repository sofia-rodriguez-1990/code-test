'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  /** Visible label text for the date input field. */
  label: string;
  /** Validation error message to display below the input. */
  error?: string;
  /** HTML id for the input element. */
  id?: string;
  /** The current date string value in YYYY-MM-DD format. */
  value: string;
  /** Called with the new YYYY-MM-DD string when the user picks a date. */
  onChange: (value: string) => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
}

function toDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Date picker input using react-datepicker.
 * Converts between YYYY-MM-DD strings (used by the form) and Date objects
 * (used by the picker).
 */
export function DateInput({ label, error, id, value, onChange, onBlur }: DateInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="form-label"
      >
        {label}
      </label>
      <DatePicker
        wrapperClassName="d-block"
        id={id}
        selected={toDate(value)}
        onChange={(date: Date | null) => onChange(toDateString(date))}
        onBlur={onBlur}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        maxDate={new Date()}
        placeholderText="Select a date"
        className={`form-control${error ? ' is-invalid' : ''}`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
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
