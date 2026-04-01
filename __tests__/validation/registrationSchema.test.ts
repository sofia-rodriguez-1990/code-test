import { describe, it, expect } from 'vitest';
import { registrationSchema, parseRegistration } from '@/lib/validation/registrationSchema';

/**
 * Unit tests for the registration Zod schema.
 *
 * These tests validate the schema in isolation — no network, no components.
 * Because the same schema runs on both client and server, confidence here
 * means confidence in both layers.
 */
describe('registrationSchema', () => {
  const validPayload = {
    firstName: 'Sofia',
    lastName: 'Andersen',
    dateOfBirth: '1990-06-15',
    reason: 'Persistent headache and dizziness for two days',
  };

  it('accepts a fully valid payload', () => {
    const result = registrationSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('rejects empty firstName', () => {
    const result = registrationSchema.safeParse({
      ...validPayload,
      firstName: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const firstNameErrors = result.error.issues.filter(
        (issue) => issue.path[0] === 'firstName'
      );
      expect(firstNameErrors).toHaveLength(1);
      expect(firstNameErrors[0].message).toBe('First name is required');
    }
  });

  it('rejects future dateOfBirth', () => {
    const futureDate = '2099-01-01';
    const result = registrationSchema.safeParse({
      ...validPayload,
      dateOfBirth: futureDate,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const dobErrors = result.error.issues.filter(
        (issue) => issue.path[0] === 'dateOfBirth'
      );
      expect(dobErrors.length).toBeGreaterThanOrEqual(1);
      expect(dobErrors.some((e) => e.message === 'Date of birth must be in the past')).toBe(
        true
      );
    }
  });

  it('rejects invalid date format like 2000-13-99', () => {
    const result = registrationSchema.safeParse({
      ...validPayload,
      dateOfBirth: '2000-13-99',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const dobErrors = result.error.issues.filter(
        (issue) => issue.path[0] === 'dateOfBirth'
      );
      expect(dobErrors.some((e) => e.message === 'Date of birth must be a valid date')).toBe(
        true
      );
    }
  });

  it('rejects reason shorter than 10 characters', () => {
    const result = registrationSchema.safeParse({
      ...validPayload,
      reason: 'Short',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const reasonErrors = result.error.issues.filter(
        (issue) => issue.path[0] === 'reason'
      );
      expect(reasonErrors.some((e) => e.message === 'Reason must be at least 10 characters')).toBe(
        true
      );
    }
  });

  it('returns only errors for failing fields', () => {
    const result = parseRegistration({
      firstName: '',
      lastName: 'Andersen',
      dateOfBirth: '1990-06-15',
      reason: 'Valid reason for emergency visit',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toHaveProperty('firstName');
      expect(result.fieldErrors).not.toHaveProperty('lastName');
      expect(result.fieldErrors).not.toHaveProperty('dateOfBirth');
      expect(result.fieldErrors).not.toHaveProperty('reason');
    }
  });
});
