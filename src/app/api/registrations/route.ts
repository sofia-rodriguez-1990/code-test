import { NextResponse } from 'next/server';
import { parseRegistration } from '@/lib/validation/registrationSchema';

/**
 * Handles patient registration form submissions.
 *
 * Parses the JSON body through the shared Zod schema. Returns 200 with the
 * validated data on success, or 422 with per-field error messages on failure.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json();
  const result = parseRegistration(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, fieldErrors: result.fieldErrors },
      { status: 422 }
    );
  }

  return NextResponse.json(
    { success: true, data: result.data },
    { status: 200 }
  );
}
