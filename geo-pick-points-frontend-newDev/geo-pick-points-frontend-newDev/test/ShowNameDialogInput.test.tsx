import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShowNameDialogInput from '../src/components/ShowNameDialogInput';

import React from 'react';
import '@testing-library/jest-dom';

// Mocking Login component, since it is being used inside ShowNameDialogInput
jest.mock('../src/Pages/Login', () => () => <div>Login Component</div>);

describe('ShowNameDialogInput', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetNickName = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the modal with name input', () => {
    render(
      <ShowNameDialogInput
        show={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        nickName=""
        setnickName={mockSetNickName}
        host={false}
      />
    );

    // Check if the modal is rendered
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter your name')).toBeInTheDocument();
    expect(screen.getByTestId('closeButton')).toBeInTheDocument();
    expect(screen.getByTestId('saveButton')).toBeInTheDocument();
  });

  test('handles close button click', () => {
    render(
      <ShowNameDialogInput
        show={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        nickName=""
        setnickName={mockSetNickName}
        host={false}
      />
    );

    // Click the close button and check if onClose is called
    fireEvent.click(screen.getByTestId('closeButton'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles save button click when nickname is valid', async () => {
    render(
      <ShowNameDialogInput
        show={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        nickName="Valid Name"
        setnickName={mockSetNickName}
        host={false}
      />
    );

    // Simulate save button click
    fireEvent.click(screen.getByTestId('saveButton'));

    // Check if onSave is called
    expect(mockOnSave).toHaveBeenCalled();
  });




  test('renders Login link at the bottom of the modal', () => {
    render(
      <ShowNameDialogInput
        show={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        nickName="Valid Name"
        setnickName={mockSetNickName}
        host={false}
      />
    );

    // Check if the login component is rendered
    expect(screen.getByText('Already have an account or wanna Signup?')).toBeInTheDocument();
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });
});



test('calls onClose when close button is clicked', () => {
  const mockOnClose = jest.fn();

  render(
    <ShowNameDialogInput
      show={true}
      onClose={mockOnClose}
      onSave={jest.fn()}
      nickName="Test Name"
      setnickName={jest.fn()}
      host={false}
    />
  );

  // Klicke auf den Close-Button
  fireEvent.click(screen.getByTestId('closeButton'));

  // Überprüfe, ob der onClose-Callback aufgerufen wurde
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});





test('renders the modal when show is true', () => {
  render(
    <ShowNameDialogInput
      show={true}
      onClose={jest.fn()}
      onSave={jest.fn()}
      nickName=""
      setnickName={jest.fn()}
      host={false}
    />
  );

  // Überprüfe, ob die Modal sichtbar ist
  expect(screen.getByTestId('DialogNameInput')).toBeInTheDocument();
});


describe("ShowNameDialogInput", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetNickName = jest.fn();


  test('does not display an error message when nickname is long enough', () => {
    render(
      <ShowNameDialogInput
        show={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        nickName="ValidName"
        setnickName={mockSetNickName}
        host={false}
      />
    );

    // Click the save button with a valid nickname
    fireEvent.click(screen.getByTestId('saveButton'));

    // Ensure no error message is displayed
    expect(screen.queryByText('Name must be at least 2 characters long.')).toBeNull();
  });
});









