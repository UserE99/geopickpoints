import { register, userData } from "../../geo-pick-points-frontend/src/actions/register";
import { createAsyncThunk } from "@reduxjs/toolkit";

describe("register async thunk", () => {
    const mockUserData: userData = {
        name: "TestUser",
        password: "securepassword",
        email: "testuser@example.com",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("🟢 Erfolgreiche Registrierung mit gültigen Daten", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: "user123", ...mockUserData }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = register(mockUserData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toEqual({ id: "user123", ...mockUserData });
    });

    test("🔴 Registrierung schlägt fehl mit 400 Bad Request", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: "Invalid request" }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = register(mockUserData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("HTTP error! Status: 400");
    });

    test("🌐 Netzwerkfehler wird korrekt behandelt", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = register(mockUserData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("Network error");
    });

    test("⚠️ Fehler, wenn ein Feld in `userData` fehlt", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 422,
                json: () => Promise.resolve({ error: "Missing fields" }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = register({ name: "TestUser", password: "", email: "" });
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("HTTP error! Status: 422");
    });

    test("📢 rejectWithValue wird aufgerufen, wenn ein Fehler auftritt", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Unexpected error"))) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = register(mockUserData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("Unexpected error");
    });
});
