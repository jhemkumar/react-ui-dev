import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlaceOrder from '../PlaceOrder';

describe('PlaceOrder Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders place order form', () => {
    render(<PlaceOrder />);
    
    expect(screen.getByLabelText(/symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<PlaceOrder />);
    
    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/symbol is required/i)).toBeInTheDocument();
      expect(screen.getByText(/quantity is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<PlaceOrder />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/symbol/i), {
      target: { value: 'BTC/USD' },
    });
    fireEvent.change(screen.getByLabelText(/order type/i), {
      target: { value: 'BUY' },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '1.5' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '50000' },
    });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Order placed:', {
        symbol: 'BTC/USD',
        orderType: 'BUY',
        quantity: 1.5,
        price: 50000,
      });
      expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('resets form after successful submission', async () => {
    render(<PlaceOrder />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/symbol/i), {
      target: { value: 'BTC/USD' },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '1.5' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '50000' },
    });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/symbol/i)).toHaveValue('');
      expect(screen.getByLabelText(/quantity/i)).toHaveValue(0);
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
    });
  });

  it('handles order type selection', () => {
    render(<PlaceOrder />);
    
    const orderTypeSelect = screen.getByLabelText(/order type/i);
    fireEvent.mouseDown(orderTypeSelect);
    
    const sellOption = screen.getByText('Sell');
    fireEvent.click(sellOption);

    expect(orderTypeSelect).toHaveValue('SELL');
  });
}); 