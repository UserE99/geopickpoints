import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import SignupPage from "../../geo-pick-points-frontend/src/Pages/Signup";
import { register } from "../../geo-pick-points-frontend/src/actions/Register";
import { authentication } from "../../geo-pick-points-frontend/src/actions/Authentication";
import { createNewPlayer } from "../../geo-pick-points-frontend/src/actions/CreateNewPlayer";

// Mock Redux Store
const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;

// ✅ Korrektes Mocking der Redux-Actions
jest.mock("../../geo-pick-points-frontend/src/actions/Register", () => ({
  register: jest.fn().mockResolvedValue({ payload: { id: "user123" } }),
}));

jest.mock("../../geo-pick-points-frontend/src/actions/Authentication", () => ({
  authentication: jest.fn().mockResolvedValue({ payload: { token: "mockToken" } }),
}));

jest.mock("../../geo-pick-points-frontend/src/actions/CreateNewPlayer", () => ({
  createNewPlayer: jest.fn().mockResolvedValue({ payload: { id: "player123" } }),
}));

describe("SignupPage Component", () => {
  beforeEach(() => {
    store = mockStore({
      authentication: { authen: { isLoggedIn: false } },
    });
  });

  test("🟢 Render SignupPage & überprüft die Eingabefelder", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("✅ Erfolgreiche Registrierung mit validen Daten", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("example marie"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "testuser@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("*****"), {
      target: { value: "Secure123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => expect(register).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(authentication).toHaveBeenCalledTimes(1));
  });

  test("🔴 Fehlerhafte Eingaben werden erkannt", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
    });
  });

  test("🌐 Netzwerkfehler wird korrekt behandelt", async () => {
    (register as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("example marie"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "testuser@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("*****"), {
      target: { value: "Secure123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  test("⚠️ Fehlerhafte Passwörter werden erkannt", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("*****"), {
      target: { value: "weak" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters long./i)).toBeInTheDocument();
      expect(screen.getByText(/Password must include at least one uppercase letter./i)).toBeInTheDocument();
      expect(screen.getByText(/Password must include at least one number or special character./i)).toBeInTheDocument();
    });
  });

  test("📢 `rejectWithValue` wird aufgerufen, wenn ein Fehler auftritt", async () => {
    (register as jest.Mock).mockResolvedValueOnce({
      payload: undefined,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("example marie"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "testuser@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("*****"), {
      target: { value: "Secure123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error during registration/i)).toBeInTheDocument();
    });
  });
});
