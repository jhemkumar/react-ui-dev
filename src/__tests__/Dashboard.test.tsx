import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from '../Dashboard';

// Mock the auth context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders dashboard with menu items', () => {
    renderDashboard();
    
    // Check for CPOMS title
    expect(screen.getByText('CPOMS')).toBeInTheDocument();
    
    // Check for menu items using their text content
    const menuItems = screen.getAllByRole('button', { name: /place order|order book/i });
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(/place order/i);
    expect(menuItems[1]).toHaveTextContent(/order book/i);
  });

  it('expands and collapses Place Order submenu', () => {
    renderDashboard();
    
    // Click Place Order to expand submenu
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    // Check if submenu items are visible
    expect(screen.getByText(/loans/i)).toBeInTheDocument();
    expect(screen.getByText(/deposits/i)).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(placeOrderButton);
    
    // Check if submenu items are hidden
    expect(screen.queryByText(/loans/i)).not.toBeVisible();
    expect(screen.queryByText(/deposits/i)).not.toBeVisible();
  });

  it('opens user profile menu when avatar is clicked', () => {
    renderDashboard();
    
    // Click user menu button
    const userMenuButton = screen.getByRole('button', { name: /user menu/i });
    fireEvent.click(userMenuButton);
    
    // Check if menu items are present
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/help/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('handles logout from user menu', () => {
    renderDashboard();
    
    // Open user menu
    const userMenuButton = screen.getByRole('button', { name: /user menu/i });
    fireEvent.click(userMenuButton);
    
    // Click logout
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    
    // Verify navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to different sections', () => {
    renderDashboard();
    
    // Navigate to Place Order
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/place-order');
    
    // Navigate to Order Book
    const orderBookButton = screen.getByRole('button', { name: /order book/i });
    fireEvent.click(orderBookButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/order-book');
    
    // Navigate to Loans submenu
    const loansButton = screen.getByText(/loans/i);
    fireEvent.click(loansButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/place-order/loans');
    
    // Navigate to Deposits submenu
    const depositsButton = screen.getByText(/deposits/i);
    fireEvent.click(depositsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/place-order/deposits');
  });
}); 