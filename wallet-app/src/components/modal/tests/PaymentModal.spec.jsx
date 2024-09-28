import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PaymentModal from '../PaymentModal';

describe('PaymentModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const isOpen = {
    open: true,
    product_id: 'test-product-id',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should call onSubmit with the correct values', async () => {
    render(<PaymentModal isOpen={isOpen} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const sessionIdInput = screen.getByTestId('session-id-input');
    const tokenInput = screen.getByTestId('token-input');

    fireEvent.change(sessionIdInput, { target: { value: 'new-session-id' } });
    fireEvent.change(tokenInput, { target: { value: 'new-token' } });

    const confirmarPayment = await screen.getAllByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmarPayment[0]);

    expect(mockOnSubmit).toHaveBeenCalledWith('new-session-id', 'new-token', 'test-product-id');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close the modal when clicking cancel', async () => {
    render(<PaymentModal isOpen={isOpen} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const cancelarPayment = await screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelarPayment[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
