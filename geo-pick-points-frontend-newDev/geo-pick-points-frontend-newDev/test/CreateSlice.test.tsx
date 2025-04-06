import { createNewPlayer } from '../src/actions/CreateNewPlayer';
import playerSlice from '../src/actions/CreateSlice';

import { configureStore } from '@reduxjs/toolkit';

import type { EntityState } from '../src/actions/CreateSlice';



import { joinInTeam } from '../src/actions/JoinTeamGame';
import { PlayerState } from '../src/actions/CreateSlice';
import { authentication } from '../src/actions/Authentication';

const initialState: EntityState = {
  users: [],
  players: [],
  teams: [],
  authen: {
    token: null,
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },
  loading: false,
  error: null,
  data: null,
};



describe('playerSlice', () => {
  test('should handle createNewPlayer.fulfilled', () => {
    const newPlayer = { id: 1, name: 'Player1', gameId: 'game123' };
    const action = { type: createNewPlayer.fulfilled.type, payload: newPlayer };

    const nextState = playerSlice(initialState, action);

    expect(nextState.players).toContainEqual(newPlayer);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('should handle createNewPlayer.fulfilled', () => {
    const newPlayer = { id: 1, name: 'Player1', gameId: 'game123' };

    const action = { type: createNewPlayer.fulfilled.type, payload: newPlayer };

    // Reduziere den Zustand mit der Action
    const nextState = playerSlice(initialState, action);

    expect(nextState.players).toContainEqual(newPlayer);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('should handle createNewPlayer.pending', () => {
    const action = { type: createNewPlayer.pending.type };

    const nextState = playerSlice(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle createNewPlayer.rejected', () => {
    const errorMessage = 'Failed to create player';
    const action = { type: createNewPlayer.rejected.type, payload: errorMessage };

    const nextState = playerSlice(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });
});

test('should handle authentication.fulfilled', () => {
  const authResponse = { token: 'testToken', user: { id: '1', name: 'User1' } };
  const action = { type: authentication.fulfilled.type, payload: authResponse };

  const nextState = playerSlice(initialState, action);

  expect(nextState.authen.token).toBe(authResponse.token);
  expect(nextState.authen.user).toEqual(authResponse.user);
  expect(nextState.authen.isLoggedIn).toBe(true);
  expect(nextState.authen.loading).toBe(false);
});

test('should handle authentication.rejected', () => {
  const errorMessage = 'Authentication failed';
  const action = { type: authentication.rejected.type, payload: errorMessage };

  const nextState = playerSlice(initialState, action);

  expect(nextState.authen.loading).toBe(false);
  expect(nextState.authen.error).toBe(errorMessage);
  expect(nextState.authen.isLoggedIn).toBe(false);
});

test('should handle authentication.logout', () => {
  const action = { type: 'auth/logout' };

  const nextState = playerSlice(initialState, action);

  expect(nextState.authen.token).toBeNull();
  expect(nextState.authen.user).toBeNull();
  expect(nextState.authen.isLoggedIn).toBe(false);
});



