import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';


import ShowShareDialog from '../src/components/ShareDiaglog';
import React from 'react';
describe('ShowShareDialog', () => {
  const mockOnClose = jest.fn();

  it('should render the modal when show is true', () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl="http://example.com" />);

    // Überprüfen, ob das Modal gerendert wird
    expect(screen.getByTestId('DialogShare')).toBeInTheDocument();
  });

  it('should display social media links correctly', () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl="http://example.com" />);

    // Überprüfen, ob die sozialen Medien-Links korrekt gerendert werden
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('X (Twitter)')).toBeInTheDocument();
    expect(screen.getByText('E-Mail')).toBeInTheDocument();
    expect(screen.getByText('VK')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('should call onClose when the modal is closed', () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl="http://example.com" />);

    // Simulieren des Klicks auf den Close-Button
    fireEvent.click(screen.getByLabelText('Close'));

    // Überprüfen, ob die onClose-Funktion aufgerufen wurde
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });



  describe('ShowShareDialog', () => {
    const mockOnClose = jest.fn();

    beforeAll(() => {
      // Mock der clipboard.writeText Methode
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn(),
        },
        writable: true, // Die Eigenschaft ist jetzt schreibbar
      });
    });

    it('should copy the link to clipboard when the copy button is clicked', async () => {
      render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl="http://example.com" />);

      // Simulieren des Klicks auf den Copy-Link-Button
      fireEvent.click(screen.getByText('copy link'));

      // Überprüfen, ob der Text in die Zwischenablage kopiert wurde
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://example.com');
      });

      // Überprüfen, ob der Button-Text geändert wurde
      expect(screen.getByText('copy!')).toBeInTheDocument();
    });


  });
});


beforeAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn(),
    },
  });
});

describe('ShowShareDialog', () => {
  const mockOnClose = jest.fn();
  const mockShareUrl = "https://example.com";

  test('renders modal and social media links', () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl={mockShareUrl} />);

    // Überprüfen, ob der Modal angezeigt wird
    expect(screen.getByTestId('DialogShare')).toBeInTheDocument();

    // Überprüfen, ob alle sozialen Links vorhanden sind
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('X (Twitter)')).toBeInTheDocument();
    expect(screen.getByText('E-Mail')).toBeInTheDocument();
    expect(screen.getByText('VK')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });


  test('copies link when copy button is clicked', async () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl={mockShareUrl} />);

    // Klicke auf den Kopieren-Button
    fireEvent.click(screen.getByText('copy link'));

    // Überprüfen, ob der Clipboard-Mock aufgerufen wurde
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareUrl));

    // Überprüfen, ob der Buttontext geändert wurde
    expect(screen.getByText('copy!')).toBeInTheDocument();
  });

  test('does not allow clicking "copy link" multiple times', async () => {
    render(<ShowShareDialog show={true} onClose={mockOnClose} shareUrl={mockShareUrl} />);

    const copyButton = screen.getByText('copy link');

    // Klicke einmal auf den Button
    fireEvent.click(copyButton);

    // Button sollte nun deaktiviert sein
    expect(copyButton).toBeDisabled();

    // Buttontext sollte auf "copy!" geändert werden
    expect(screen.getByText('copy!')).toBeInTheDocument();
  });
});