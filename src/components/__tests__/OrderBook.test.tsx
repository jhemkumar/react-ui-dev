import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderBook from '../OrderBook';

describe('OrderBook Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order book with tabs', () => {
    render(<OrderBook />);
    
    expect(screen.getByRole('tab', { name: /all orders/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /loans/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /deposits/i })).toBeInTheDocument();
  });

  it('displays table headers', () => {
    render(<OrderBook />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Symbol')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<OrderBook />);
    
    // Check initial tab (All Orders)
    expect(screen.getByRole('tab', { name: /all orders/i })).toHaveAttribute('aria-selected', 'true');
    
    // Switch to Loans tab
    fireEvent.click(screen.getByRole('tab', { name: /loans/i }));
    expect(screen.getByRole('tab', { name: /loans/i })).toHaveAttribute('aria-selected', 'true');
    
    // Switch to Deposits tab
    fireEvent.click(screen.getByRole('tab', { name: /deposits/i }));
    expect(screen.getByRole('tab', { name: /deposits/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('displays mock orders', () => {
    render(<OrderBook />);
    
    // Check if mock orders are displayed
    expect(screen.getByText('BTC/USD')).toBeInTheDocument();
    expect(screen.getByText('ETH/USD')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('handles pagination', () => {
    render(<OrderBook />);
    
    // Check if pagination controls are present
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Rows per page select
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    
    // Test changing rows per page
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('25'));
    expect(select).toHaveTextContent('25');
    
    // Test page navigation
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    
    // Initially, previous button should be disabled
    expect(prevButton).toBeDisabled();
    
    // Click next page
    fireEvent.click(nextButton);
    expect(prevButton).not.toBeDisabled();
  });

  it('displays status chips with correct colors', () => {
    render(<OrderBook />);
    
    const completedChip = screen.getByText('COMPLETED');
    const pendingChip = screen.getByText('PENDING');
    
    expect(completedChip).toHaveClass('MuiChip-colorSuccess');
    expect(pendingChip).toHaveClass('MuiChip-colorWarning');
  });

  it('filters orders based on selected tab', () => {
    render(<OrderBook />);
    
    // Initially shows all orders
    expect(screen.getByText('BTC/USD')).toBeInTheDocument();
    expect(screen.getByText('ETH/USD')).toBeInTheDocument();
    
    // Switch to Loans tab (BUY orders)
    fireEvent.click(screen.getByRole('tab', { name: /loans/i }));
    expect(screen.getByText('BTC/USD')).toBeInTheDocument();
    expect(screen.queryByText('ETH/USD')).not.toBeInTheDocument();
    
    // Switch to Deposits tab (SELL orders)
    fireEvent.click(screen.getByRole('tab', { name: /deposits/i }));
    expect(screen.queryByText('BTC/USD')).not.toBeInTheDocument();
    expect(screen.getByText('ETH/USD')).toBeInTheDocument();
  });
}); 