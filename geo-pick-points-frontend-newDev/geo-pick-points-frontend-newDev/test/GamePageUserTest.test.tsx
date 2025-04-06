import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import GamePageUser from '../src/Pages/GamePageUser';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockStore = configureStore([]);

test('renders the GamePageUser component and matches the snapshot', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
    authentication: {
      authen: {
        isLoggedIn: true,
      },
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: {
      nickName: 'TestPlayer',
      host: true,
      idOfUser: '1',
      email: 'test@example.com',
    },
  });

  const { asFragment } = render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePageUser nickName="TestPlayer" host={true} idOfUser="1" email="test@example.com" />
      </MemoryRouter>
    </Provider>
  );

  expect(asFragment()).toMatchSnapshot();
});

test('displays the welcome message correctly', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
    authentication: {
      authen: {
        isLoggedIn: true,
      },
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: {
      nickName: 'TestPlayer',
      host: true,
      idOfUser: '1',
      email: 'test@example.com',
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePageUser nickName="TestPlayer" host={true} idOfUser="1" email="test@example.com" />
      </MemoryRouter>
    </Provider>
  );

  const headingElements = screen.getAllByText((content, element) => {
    return element?.textContent?.trim() === "Hallo, TestPlayer !";
  });
  
  expect(headingElements[0]).toBeInTheDocument();});


test('shows HostBuildDialog when HostBuildButton is clicked', () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
    authentication: {
      authen: {
        isLoggedIn: true,
      },
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: {
      nickName: 'TestPlayer',
      host: true,
      idOfUser: '1',
      email: 'test@example.com',
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePageUser nickName="TestPlayer" host={true} idOfUser="1" email="test@example.com" />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Create Teams/i }));

  expect(screen.getByText(/Create Game to be Host/i)).toBeInTheDocument();
});
