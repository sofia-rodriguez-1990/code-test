import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/registrations/route';

/**
 * Tests for the POST /api/registrations API route.
 *
 * These tests call the route handler directly with constructed Request objects,
 * bypassing the HTTP layer. This is the recommended approach for testing
 * Next.js App Router route handlers — fast, isolated, and deterministic.
 */
describe('POST /api/registrations', () => {
  /**
   * Helper to create a Request object with a JSON body,
   * matching what Next.js passes to route handlers.
   */
  function createRequest(body: unknown): Request {
    return new Request('http://localhost/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('returns 422 with field errors for empty body', async () => {
    const request = createRequest({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      reason: '',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.fieldErrors).toHaveProperty('firstName');
    expect(body.fieldErrors).toHaveProperty('lastName');
    expect(body.fieldErrors).toHaveProperty('dateOfBirth');
    expect(body.fieldErrors).toHaveProperty('reason');
  });

  it('returns 422 for future dateOfBirth with other fields valid', async () => {
    const request = createRequest({
      firstName: 'Sofia',
      lastName: 'Andersen',
      dateOfBirth: '2099-01-01',
      reason: 'Persistent headache and dizziness',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.fieldErrors).toHaveProperty('dateOfBirth');
    expect(body.fieldErrors).not.toHaveProperty('firstName');
    expect(body.fieldErrors).not.toHaveProperty('lastName');
    expect(body.fieldErrors).not.toHaveProperty('reason');
  });

  it('returns 200 with parsed data for valid payload', async () => {
    const validPayload = {
      firstName: 'Sofia',
      lastName: 'Andersen',
      dateOfBirth: '1990-06-15',
      reason: 'Persistent headache and dizziness',
    };

    const request = createRequest(validPayload);
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(validPayload);
  });
});
