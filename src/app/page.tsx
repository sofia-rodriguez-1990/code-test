import { redirect } from 'next/navigation';

/**
 * Root page — redirects to the registration form.
 */
export default function HomePage() {
  redirect('/register');
}
