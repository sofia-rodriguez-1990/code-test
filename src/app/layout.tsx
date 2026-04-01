import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'ER CareView — Patient Registration',
  description:
    'Patient registration form for the ER CareView dashboard. Part of the Sync Technologies technical assessment.',
};

/**
 * Root layout wrapping every page with shared providers and global styles.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
