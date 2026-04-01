'use client';

import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registrationSchema } from '@/lib/validation/registrationSchema';
import type { RegistrationFormValues } from '@/lib/validation/registrationSchema';
import type { ApiErrorResponse } from '@/types/registration';
import { TextInput } from '@/components/ui/TextInput';
import { TextArea } from '@/components/ui/TextArea';
import { DateInput } from '@/components/ui/DateInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { SuccessCard } from '@/components/ui/SuccessCard';

/**
 * Sends the registration payload to the API and returns the parsed response.
 * Throws on non-OK responses so TanStack Query treats them as errors.
 */
async function submitRegistration(
  values: RegistrationFormValues
): Promise<RegistrationFormValues> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  const body = await response.json();

  if (!response.ok) {
    throw body as ApiErrorResponse;
  }

  return body.data as RegistrationFormValues;
}

/**
 * Patient registration form orchestrator.
 *
 * Combines React Hook Form (for client-side validation with Zod) and
 * TanStack Query's useMutation (for the API submission). On success,
 * the form is replaced by a confirmation card. On server-side validation
 * failure (422), errors are mapped back onto the form fields.
 */
export function RegistrationForm() {
  const successCardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      reason: '',
    },
  });

  const mutation = useMutation({
    mutationFn: submitRegistration,
    onSuccess: () => {
      setTimeout(() => {
        successCardRef.current?.focus();
      }, 0);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiErrorResponse;
      if (apiError?.fieldErrors) {
        const fieldNames = ['firstName', 'lastName', 'dateOfBirth', 'reason'] as const;
        for (const field of fieldNames) {
          const message = apiError.fieldErrors[field];
          if (message) {
            setError(field, { type: 'server', message });
          }
        }
      }
    },
  });

  const onSubmit = (values: RegistrationFormValues) => {
    mutation.mutate(values);
  };

  if (mutation.isSuccess && mutation.data) {
    return (
      <SuccessCard ref={successCardRef} firstName={mutation.data.firstName} />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Patient registration"
      noValidate
    >
      <TextInput
        label="First Name"
        id="firstName"
        error={errors.firstName?.message}
        {...register('firstName')}
      />

      <TextInput
        label="Last Name"
        id="lastName"
        error={errors.lastName?.message}
        {...register('lastName')}
      />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <DateInput
            label="Date of Birth"
            id="dateOfBirth"
            error={errors.dateOfBirth?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      <TextArea
        label="Reason for Visit"
        id="reason"
        error={errors.reason?.message}
        {...register('reason')}
      />

      <div className="mt-6">
        <SubmitButton isSubmitting={mutation.isPending} />
      </div>
    </form>
  );
}
