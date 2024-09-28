import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BalanceModal from '../BalanceModal';

import { useAuthStore } from '../../../store';

vi.mock('../../../store', () => ({
  useAuthStore: vi.fn(),
}));

describe('BalanceModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockUser = {
    document: '12345678',
    phone: '987654321',
  };

  beforeEach(() => {
    useAuthStore.mockReturnValue({ user: mockUser });
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('you must call onSubmit with the correct values', async () => {
    render(<BalanceModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const documentInput = screen.getByTestId('document-input');
    const phoneInput = screen.getByTestId('phone-input');

    fireEvent.change(documentInput, { target: { value: '87654321' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });

    const solicitarPayment = await screen.getAllByRole('button', { name: /solicitar/i });
    fireEvent.click(solicitarPayment[0]);

    expect(mockOnSubmit).toHaveBeenCalledWith('87654321', '123456789');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close the modal when clicking cancel', async () => {
    render(<BalanceModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const cancelarPayment = await screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelarPayment[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
