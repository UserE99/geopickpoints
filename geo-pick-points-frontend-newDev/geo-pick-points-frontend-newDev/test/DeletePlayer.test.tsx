import { unjoinTeamDel, UnjoinTeamData } from "../../geo-pick-points-frontend/src/actions/DeletePlayer";
import { createAsyncThunk } from "@reduxjs/toolkit";

describe("unjoinTeamDel async thunk", () => {
    const mockUnjoinData: UnjoinTeamData = {
        teamID: "team123",
        playerID: "player456",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("🟢 Funktion ist definiert", () => {
        expect(unjoinTeamDel).toBeDefined();
    });

    test("✅ Erfolgreiches Entfernen eines Spielers", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = unjoinTeamDel(mockUnjoinData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toEqual({ success: true });
    });

    test("🔴 Entfernen schlägt fehl mit 400 Bad Request", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: "Invalid request" }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = unjoinTeamDel(mockUnjoinData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("HTTP error! Status: 400");
    });

    test("🌐 Netzwerkfehler wird korrekt behandelt", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = unjoinTeamDel(mockUnjoinData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("Network error");
    });

    test("⚠️ Fehler, wenn `teamID` oder `playerID` fehlt", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 422,
                json: () => Promise.resolve({ error: "Missing fields" }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = unjoinTeamDel({ teamID: "", playerID: "" });
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("HTTP error! Status: 422");
    });

    test("📢 `rejectWithValue` wird aufgerufen, wenn ein Fehler auftritt", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Unexpected error"))) as jest.Mock;

        const dispatch = jest.fn();
        const thunk = unjoinTeamDel(mockUnjoinData);
        const result = await thunk(dispatch, () => {}, undefined);

        expect(result.payload).toBe("Unexpected error");
    });
});
