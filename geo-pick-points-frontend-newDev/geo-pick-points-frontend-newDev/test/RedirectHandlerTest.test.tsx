import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RedirectHandler from '../src/components/RedirectHandler';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

test('redirects to the correct URL when parameters are valid', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  (useParams as jest.Mock).mockReturnValue({ codeInvite: 'testCode' });
  (useSearchParams as jest.Mock).mockReturnValue([
    new URLSearchParams('?feature=shared'),
  ]);

  render(
    <MemoryRouter>
      <RedirectHandler />
    </MemoryRouter>
  );

  expect(mockNavigate).toHaveBeenCalledWith('/codelobbygame?c=testCode');
});

test('logs an error when parameters are missing or invalid', () => {
  const mockNavigate = jest.fn();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  (useParams as jest.Mock).mockReturnValue({ codeInvite: undefined });
  (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);

  render(
    <MemoryRouter>
      <RedirectHandler />
    </MemoryRouter>
  );

  expect(mockConsoleError).toHaveBeenCalledWith(
    'Ungültige URL oder fehlende Parameter.'
  );
  expect(mockNavigate).not.toHaveBeenCalled();

  mockConsoleError.mockRestore();
});
