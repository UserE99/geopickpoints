import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Logout from "../src/components/Logout";
import { useDispatch, useSelector } from "react-redux";

// ✅ Mock Redux Store
const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;

// ✅ Mock Funktionen
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseSelector = jest.fn(); // Mock `useSelector`

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: () => mockUseSelector(), // ✅ Korrekte Mock-Funktion für useSelector
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Logout Component", () => {
  beforeEach(() => {
    store = mockStore({
      authentication: { authen: { isLoggedIn: true } },
    });

    mockUseSelector.mockReturnValue(true); // ✅ Mock isLoggedIn Wert
    jest.spyOn(window.location, "assign").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  test("🟢 Render Logout-Button korrekt", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  test("✅ Erfolgreicher Logout löscht `authToken` aus SessionStorage und LocalStorage", async () => {
    sessionStorage.setItem("authToken", "mockToken");
    localStorage.setItem("authToken", "mockToken");

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(sessionStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("🔴 `auth/logout` Action wird korrekt dispatched", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(mockDispatch).toHaveBeenCalledWith({ type: "auth/logout" });
  });

  test("🌐 Redirect nach `/` erfolgt nach Logout", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
