import { createNewPlayer, PlayerData } from "../src/actions/CreateNewPlayer"; // Import aus dem actions-Ordner
describe("createNewPlayer thunk", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Setzt alle Mocks zurück
    });

    it("should dispatch fulfilled action when API call succeeds", async () => {
        // Mock für fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, nickName: "Player1", host: true }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const getState = jest.fn();

        const playerData = { nickName: "Player1", host: true };
        const thunk = createNewPlayer(playerData);

        const result = await thunk(dispatch, getState, undefined);

        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
        });
        expect(result.type).toBe("createNewPlayer/fulfilled");
        expect(result.payload).toEqual({ id: 1, nickName: "Player1", host: true });
    });

    it("should dispatch rejected action when API call fails", async () => {
        // Mock für fetch
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Network Error"))
        ) as jest.Mock;

        const dispatch = jest.fn();
        const getState = jest.fn();

        const playerData = { nickName: "Player2", host: false };
        const thunk = createNewPlayer(playerData);

        const result = await thunk(dispatch, getState, undefined);

        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
        });
        expect(result.type).toBe("createNewPlayer/rejected");
        expect(result.payload).toBe("Network Error");
    });







    it("should dispatch rejected action when server returns an error", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ message: "Internal Server Error" }),
            })
        ) as jest.Mock;
    
        const dispatch = jest.fn();
        const getState = jest.fn();
    
        const playerData = { nickName: "Player3", host: true };
        const thunk = createNewPlayer(playerData);
    
        const result = await thunk(dispatch, getState, undefined);
    
        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
        });
        expect(result.type).toBe("createNewPlayer/rejected");
        expect(result.payload).toBe("HTTP error! Status: 500");
    });

    




    
    






    it("should handle unexpected errors gracefully", async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Unexpected error"))
        ) as jest.Mock;
    
        const dispatch = jest.fn();
        const getState = jest.fn();
    
        const playerData = { nickName: "Player6", host: true };
        const thunk = createNewPlayer(playerData);
    
        const result = await thunk(dispatch, getState, undefined);
    
        expect(result.type).toBe("createNewPlayer/rejected");
        expect(result.payload).toBe("Unexpected error");
    });

    





    it("should dispatch fulfilled action when player data is formatted correctly", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 2, nickName: "Player7", host: false }),
            })
        ) as jest.Mock;
    
        const dispatch = jest.fn();
        const getState = jest.fn();
    
        const playerData = { nickName: "Player7", host: false };
        const thunk = createNewPlayer(playerData);
    
        const result = await thunk(dispatch, getState, undefined);
    
        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
        });
        expect(result.type).toBe("createNewPlayer/fulfilled");
        expect(result.payload).toEqual({ id: 2, nickName: "Player7", host: false });
    });
    
});




it("should dispatch rejected action when API returns invalid JSON", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.reject(new Error("Invalid JSON")),
        })
    ) as jest.Mock;

    const dispatch = jest.fn();
    const getState = jest.fn();

    const playerData = { nickName: "Player4", host: false };
    const thunk = createNewPlayer(playerData);

    const result = await thunk(dispatch, getState, undefined);

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
    });
    expect(result.type).toBe("createNewPlayer/rejected");
    expect(result.payload).toBe("Invalid JSON");
});





it("should handle unexpected errors gracefully", async () => {
    global.fetch = jest.fn(() =>
        Promise.reject(new Error("Unexpected error"))
    ) as jest.Mock;

    const dispatch = jest.fn();
    const getState = jest.fn();

    const playerData = { nickName: "Player5", host: true };
    const thunk = createNewPlayer(playerData);

    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe("createNewPlayer/rejected");
    expect(result.payload).toBe("Unexpected error");
});
