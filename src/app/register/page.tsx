import { RegistrationForm } from '@/components/registration/RegistrationForm';

/**
 * Patient registration page.
 * Renders the registration form inside a centered card layout.
 */
export default function RegisterPage() {
  return (
    <main className="min-vh-100 d-flex align-items-start justify-content-center px-3 pt-5">
      <div className="w-100 rounded-3 bg-body-tertiary p-4 shadow" style={{ maxWidth: '28rem' }}>
        <h1 className="mb-4 fw-bold">
          Patient Registration
        </h1>
        <RegistrationForm />
      </div>
    </main>
  );
}
