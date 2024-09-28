import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthStore } from '../../store';

vi.mock('../../store', () => ({
  useAuthStore: vi.fn(),
}));

describe('Navbar', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    mockLogout.mockClear();
  });

  it('should call logout when clicking the logout button', () => {
    useAuthStore.mockReturnValue({
      user: { role: 'admin' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
