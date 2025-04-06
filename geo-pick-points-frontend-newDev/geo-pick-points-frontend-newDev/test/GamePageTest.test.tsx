import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import GamePage from '../src/Pages/GamePage';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockStore = configureStore([]);

test('renders the GamePage component and matches the snapshot', () => {
  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: true },
  });

  const { asFragment } = render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={true} />
      </MemoryRouter>
    </Provider>
  );

  expect(asFragment()).toMatchSnapshot();
});

test('displays the welcome message correctly', () => {
  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: true },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={true} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(/Welcome to the GEO Pick Points, TestPlayer!/i)
  ).toBeInTheDocument();
});

test('shows an error when submitting an invalid invite code', async () => {
  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: false },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={false} />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your code/i), {
    target: { value: '123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Join Game!/i }));

  await waitFor(() => {
    expect(
      screen.getByText(/Invite-Code must be at least 6 characters long./i)
    ).toBeInTheDocument();
  });
});

test('navigates to LobbyGamePage when a valid invite code is submitted', async () => {
  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
  });

  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: false },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={false} />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(screen.getByPlaceholderText(/enter your code/i), {
    target: { value: 'validCode' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Join Game!/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/LobbyGamePage', {
      state: { codeInvite: 'validCode', playerID: '1234', nickName: 'TestPlayer' },
    });
  });
});

test('opens HostBuildDialog when HostBuildButton is clicked', () => {
  const store = mockStore({
    players: {
      players: [{ id: '1234', name: 'TestPlayer' }],
      loading: false,
      error: null,
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: true },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={true} />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Create Teams/i }));

  expect(screen.getByText(/Host Build Dialog/i)).toBeInTheDocument();
});

test('shows loading state while players are being fetched', () => {
  const store = mockStore({
    players: {
      players: [],
      loading: true,
      error: null,
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: true },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={true} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByText(/Setting up your player.../i)).toBeInTheDocument();
});

test('shows an error message if there is an error fetching players', () => {
  const store = mockStore({
    players: {
      players: [],
      loading: false,
      error: 'Error fetching players',
    },
  });

  (useLocation as jest.Mock).mockReturnValue({
    state: { nickName: 'TestPlayer', host: true },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <GamePage nickName="TestPlayer" host={true} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(/An error occurred: Error fetching players/i)
  ).toBeInTheDocument();
});
