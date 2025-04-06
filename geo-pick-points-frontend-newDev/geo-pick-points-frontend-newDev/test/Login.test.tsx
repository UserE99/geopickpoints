import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import LoginPage from "../../geo-pick-points-frontend/src/Pages/Login";
import { authentication } from "../../geo-pick-points-frontend/src/actions/Authentication";
import { createNewPlayer } from "../../geo-pick-points-frontend/src/actions/CreateNewPlayer";

// Redux Store Mock
const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;

// ✅ Korrekte Mocking von `authentication` und `createNewPlayer`
jest.mock("../../geo-pick-points-frontend/src/actions/Authentication", () => ({
  authentication: jest.fn().mockResolvedValue({ payload: { token: "mockToken" } }),
}));

jest.mock("../../geo-pick-points-frontend/src/actions/CreateNewPlayer", () => ({
  createNewPlayer: jest.fn().mockResolvedValue({ payload: { id: "player123" } }),
}));

describe("LoginPage Component", () => {
  beforeEach(() => {
    store = mockStore({
      authentication: { authen: { isLoggedIn: false } },
    });
  });

  test("🟢 Render LoginPage & Dialog öffnet sich", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // Überprüfe, ob das `Login`-Modal geöffnet werden kann
    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });

  test("✅ Erfolgreicher Login mit validen Daten", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "securepassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(authentication).toHaveBeenCalledTimes(1));

    await waitFor(() => expect(createNewPlayer).toHaveBeenCalledTimes(1));
  });

  test("🔴 Fehlerhafte Anmeldedaten geben eine Fehlermeldung zurück", async () => {
    (authentication as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "WrongUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("🌐 Netzwerkfehler wird korrekt behandelt", async () => {
    (authentication as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "securepassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  test("⚠️ Login schlägt fehl, wenn Eingaben fehlen", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  test("📢 `rejectWithValue` wird aufgerufen, wenn ein Fehler auftritt", async () => {
    (authentication as jest.Mock).mockResolvedValueOnce({
      payload: undefined,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "securepassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText(/Error during login/i)).toBeInTheDocument();
    });
  });
});
