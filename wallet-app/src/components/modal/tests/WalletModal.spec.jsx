import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import WalletModal from '../WalletModal';
import { useAuthStore } from '../../../store';

describe('WalletModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();

    useAuthStore.setState({
      user: { document: '12345678', phone: '987654321' },
    });
  });

  it('should call onSubmit with the correct values', () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const documentInput = screen.getByTestId('document-input');
    const phoneInput = screen.getByTestId('phone-input');
    const valueInput = screen.getByTestId('value-input');

    fireEvent.change(documentInput, { target: { value: '87654321' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.change(valueInput, { target: { value: '100' } });

    fireEvent.click(screen.getByRole('button', { name: /recargar/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith('87654321', '123456789', '100');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close the modal when clicking cancel', async () => {
    render(<WalletModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const cancelarPayment = await screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelarPayment[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
