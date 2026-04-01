import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegistrationForm } from '@/components/registration/RegistrationForm';

/**
 * Creates a fresh QueryClient and wrapper for each test,
 * preventing shared cache state between tests.
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('RegistrationForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders all four fields with accessible labels', () => {
      render(<RegistrationForm />, { wrapper: createWrapper() });

      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
      expect(screen.getByLabelText('Reason for Visit')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });
  });

  describe('client-side validation', () => {
    it('displays errors for all fields when submitting empty form', async () => {
      render(<RegistrationForm />, { wrapper: createWrapper() });

      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      expect(screen.getByText('Reason for visit is required')).toBeInTheDocument();
    });

    it('displays error on blur when a single field is invalid', async () => {
      render(<RegistrationForm />, { wrapper: createWrapper() });

      const firstNameInput = screen.getByLabelText('First Name');
      await user.click(firstNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });

    it('preserves entered values after failed validation', async () => {
      render(<RegistrationForm />, { wrapper: createWrapper() });

      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');

      await user.type(firstNameInput, 'Sofia');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });

      expect(firstNameInput).toHaveValue('Sofia');
      expect(lastNameInput).toHaveValue('');
    });
  });

  describe('submission', () => {
    it('sends data to API and shows success card on valid submit', async () => {
      const mockResponse = {
        success: true,
        data: {
          firstName: 'Sofia',
          lastName: 'Andersen',
          dateOfBirth: '1990-06-15',
          reason: 'Persistent headache and dizziness',
        },
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<RegistrationForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText('First Name'), 'Sofia');
      await user.type(screen.getByLabelText('Last Name'), 'Andersen');
      await user.type(screen.getByLabelText('Date of Birth'), '1990-06-15');
      await user.type(
        screen.getByLabelText('Reason for Visit'),
        'Persistent headache and dizziness'
      );

      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(screen.getByText('Registration submitted')).toBeInTheDocument();
      });
      expect(screen.getByText(/Thank you, Sofia/)).toBeInTheDocument();
    });

    it('displays server-returned field errors on 422 response', async () => {
      const errorResponse = {
        success: false,
        fieldErrors: {
          firstName: 'First name is required',
          reason: 'Reason must be at least 10 characters',
        },
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => errorResponse,
      } as Response);

      render(<RegistrationForm />, { wrapper: createWrapper() });

      // Fill all fields so client-side validation passes
      await user.type(screen.getByLabelText('First Name'), 'Sofia');
      await user.type(screen.getByLabelText('Last Name'), 'Andersen');
      await user.type(screen.getByLabelText('Date of Birth'), '1990-06-15');
      await user.type(
        screen.getByLabelText('Reason for Visit'),
        'Persistent headache and dizziness'
      );

      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Reason must be at least 10 characters')
      ).toBeInTheDocument();
    });
  });
});
