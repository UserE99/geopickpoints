import gameStatusReducer, { startGame, resetGame } from '../src/actions/gameStatusSlice';

describe('gameStatusSlice', () => {
  const initialState = { isGameStarted: false };

  test('should return the initial state', () => {
    const result = gameStatusReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  test('should handle startGame action', () => {
    const result = gameStatusReducer(initialState, startGame());
    expect(result.isGameStarted).toBe(true);
  });

  test('should handle resetGame action', () => {
    const result = gameStatusReducer({ isGameStarted: true }, resetGame());
    expect(result.isGameStarted).toBe(false);
  });
});
