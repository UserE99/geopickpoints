import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameOverPage from "../src/Pages/GameOverPage";
import { Provider } from "react-redux";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("GameOverPage Component", () => {
  let store;
  let mockNavigate;

  beforeEach(() => {
    store = mockStore({}); 
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        dataGameInstance: {
          payload: { startTime: new Date(Date.now() - 60000).toISOString() }, 
        },
        scores: new Map([
          ["Team A", 100],
          ["Team B", 80],
        ]),
      },
    });
  });

  it("renders GameOverPage correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays game time correctly if available", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    expect(screen.getByText(/1 minutes and \d{1,2} seconds/i)).toBeInTheDocument();
  });

  it("displays 'Not available' ", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        dataGameInstance: { payload: {} }, 
        scores: new Map(),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    expect(screen.getByText(/Not available/i)).toBeInTheDocument();
  });

  it("displays team scores correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Scores/i)).toBeInTheDocument();
    expect(screen.getByText(/Team A - Score 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Team B - Score 80/i)).toBeInTheDocument();
  });

  it("shows 'No scores available'", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        dataGameInstance: { payload: {} },
        scores: new Map(), 
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/No scores available/i)).toBeInTheDocument();
  });

  it("navigates back to start ", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameOverPage />
        </MemoryRouter>
      </Provider>
    );

    const backButton = screen.getByRole("button", { name: /Back to Start/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

