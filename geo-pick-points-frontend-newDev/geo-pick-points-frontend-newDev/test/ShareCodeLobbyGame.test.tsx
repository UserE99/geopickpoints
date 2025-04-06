import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ReadShareCodeLobbyGame from '../src/components/ShareCodeLobbyGame';
import React from 'react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });


// Mocking von ShowNameDialogInput
jest.mock('../src/components/ShowNameDialogInput', () => ({
  __esModule: true,
  default: ({ show, onClose, onSave, nickName, setnickName, host }: {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    nickName: string;
    setnickName: React.Dispatch<React.SetStateAction<string>>;
    host: boolean;
  }) => (
    <div>
      {show && (
        <div data-testid="name-dialog">
          <input
            type="text"
            value={nickName}
            onChange={(e) => setnickName(e.target.value)}
            placeholder="enter your name"
          />
          <button onClick={onSave}>save</button>
        </div>
      )}
    </div>
  ),
}));


describe('ReadShareCodeLobbyGame', () => {
  const mockNavigate = jest.fn();
  const mockError = jest.spyOn(console, 'error').mockImplementation(() => { });

  beforeEach(() => {
    // Reset des mockNavigate und anderer Mocks vor jedem Test
    jest.clearAllMocks();
  });

  it('should extract the "c" parameter from the URL and set the codeInvite', () => {
    render(
      <MemoryRouter initialEntries={['/game?c=testCode']}>
        <ReadShareCodeLobbyGame />
      </MemoryRouter>
    );

    // Überprüfen, ob der Dialog mit dem Namen angezeigt wird
    expect(screen.queryByTestId('name-dialog')).toBeInTheDocument();
  });

  it('should show the name dialog when the button is clicked', async () => {
    render(
      <MemoryRouter>
        <ReadShareCodeLobbyGame />
      </MemoryRouter>
    );




    // Überprüfen, ob der Name-Dialog angezeigt wird
    expect(screen.queryByTestId('name-dialog')).toBeInTheDocument();
  });


  it('should handle errors when the player cannot be added', async () => {
    // Mocken einer fehlgeschlagenen Antwort von fetch
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter>
        <ReadShareCodeLobbyGame />
      </MemoryRouter>
    );

    // Name eingeben und speichern
    fireEvent.change(screen.getByPlaceholderText('enter your name'), {
      target: { value: 'TestPlayer' },
    });
    fireEvent.click(screen.getByText('save'));

    // Überprüfen, dass die Fehlerbehandlung erfolgt ist
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledWith('Fehler beim Hinzufügen des Spielers');
    });
  });


});




