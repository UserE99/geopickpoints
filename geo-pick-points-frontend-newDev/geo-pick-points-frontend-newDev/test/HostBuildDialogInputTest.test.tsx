import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HostBuildDialogInput from '../src/components/HostBuildDialogInput';

describe('HostBuildDialogInput Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetNameOfTeam = jest.fn();
  const mockSetAmountOfTeam = jest.fn();

  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    nameOfTeam: 'TestTeam',
    setNameOfTeam: mockSetNameOfTeam,
    amountOfTeam: '',
    setAmountOfTeam: mockSetAmountOfTeam,
    playersID: ['player1', 'player2'],
  };

  test('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<HostBuildDialogInput {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders modal title and inputs correctly', () => {
    render(<HostBuildDialogInput {...defaultProps} />);

    expect(
      screen.getByText(/How many team your wanna build \?/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter number of team/i)).toBeInTheDocument();
  });

  test('calls setAmountOfTeam when input is changed', () => {
    render(<HostBuildDialogInput {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter number of team/i);
    fireEvent.change(input, { target: { value: '5' } });

    expect(mockSetAmountOfTeam).toHaveBeenCalledWith('5');
  });

  test('calls onClose when the cancel button is clicked', () => {
    render(<HostBuildDialogInput {...defaultProps} />);

    const closeButton = screen.getByTestId('closeButton');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onSave when the save button is clicked', () => {
    render(<HostBuildDialogInput {...defaultProps} />);

    const saveButton = screen.getByTestId('saveButton');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });
  
});

