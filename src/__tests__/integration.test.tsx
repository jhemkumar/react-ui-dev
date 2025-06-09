import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';

// Mock fetch for login
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Application Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('completes full login to dashboard flow', async () => {
    // Mock successful login response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    renderApp();

    // Fill login form
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit login form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for dashboard to appear
    await waitFor(() => {
      expect(screen.getByText(/CPOMS/i)).toBeInTheDocument();
    });

    // Verify dashboard elements
    expect(screen.getByText(/Place Order/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Book/i)).toBeInTheDocument();
  });

  it('navigates through dashboard features', async () => {
    // Mock successful login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    renderApp();

    // Login
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for dashboard
    await waitFor(() => {
      expect(screen.getByText(/CPOMS/i)).toBeInTheDocument();
    });

    // Test Place Order navigation
    fireEvent.click(screen.getByText(/Place Order/i));
    await waitFor(() => {
      expect(screen.getByText(/Place New Order/i)).toBeInTheDocument();
    });

    // Test Order Book navigation
    fireEvent.click(screen.getByText(/Order Book/i));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /all orders/i })).toBeInTheDocument();
    });

    // Test user menu
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Help/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('handles order placement and viewing', async () => {
    // Mock successful login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    renderApp();

    // Login
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for dashboard
    await waitFor(() => {
      expect(screen.getByText(/CPOMS/i)).toBeInTheDocument();
    });

    // Navigate to Place Order
    fireEvent.click(screen.getByText(/Place Order/i));
    await waitFor(() => {
      expect(screen.getByText(/Place New Order/i)).toBeInTheDocument();
    });

    // Fill order form
    await userEvent.type(screen.getByLabelText(/symbol/i), 'BTC/USD');
    await userEvent.selectOptions(screen.getByLabelText(/order type/i), 'BUY');
    await userEvent.type(screen.getByLabelText(/quantity/i), '1.5');
    await userEvent.type(screen.getByLabelText(/price/i), '50000');

    // Submit order
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/Order placed successfully/i)).toBeInTheDocument();
    });

    // Navigate to Order Book
    fireEvent.click(screen.getByText(/Order Book/i));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /all orders/i })).toBeInTheDocument();
    });

    // Verify order appears in book
    expect(screen.getByText('BTC/USD')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('handles logout flow', async () => {
    // Mock successful login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    renderApp();

    // Login
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for dashboard
    await waitFor(() => {
      expect(screen.getByText(/CPOMS/i)).toBeInTheDocument();
    });

    // Open user menu and logout
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    fireEvent.click(screen.getByText(/Logout/i));

    // Verify redirect to login
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    // Verify token is cleared
    expect(localStorage.getItem('token')).toBeNull();
  });
}); 