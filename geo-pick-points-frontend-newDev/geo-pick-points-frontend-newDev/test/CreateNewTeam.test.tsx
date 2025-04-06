import { createNewTeam, TeamData } from "../src/actions/CreateNewTeam";

describe("createNewTeam thunk", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Setzt alle Mocks zurück
    });

    it("should dispatch fulfilled action when API call succeeds", async () => {
        // Mock für fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, nameOfTeam: "Team Alpha", playersID: ["1", "2"], host: true }),
            })
        ) as jest.Mock;

        const dispatch = jest.fn();
        const getState = jest.fn();

        const teamData: TeamData = { playersID: ["1", "2"], amountOfTeam: 2, nameOfTeam: "Team Alpha", host: true };
        const thunk = createNewTeam(teamData);

        const result = await thunk(dispatch, getState, undefined);

        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}team`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teamData),
        });
        expect(result.type).toBe("createNewTeam/fulfilled");
        expect(result.payload).toEqual({ id: 1, nameOfTeam: "Team Alpha", playersID: ["1", "2"], host: true });
    });
});



it("should dispatch rejected action when API call fails due to network error", async () => {
    // Mock für fetch
    global.fetch = jest.fn(() =>
        Promise.reject(new Error("Network Error"))
    ) as jest.Mock;

    const dispatch = jest.fn();
    const getState = jest.fn();

    const teamData: TeamData = { playersID: ["1", "2"], amountOfTeam: 2, nameOfTeam: "Team Beta", host: false };
    const thunk = createNewTeam(teamData);

    const result = await thunk(dispatch, getState, undefined);

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
    });
    expect(result.type).toBe("createNewTeam/rejected");
    expect(result.payload).toBe("Network Error");
});




it("should dispatch rejected action when server returns a 500 error", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: "Internal Server Error" }),
        })
    ) as jest.Mock;

    const dispatch = jest.fn();
    const getState = jest.fn();

    const teamData: TeamData = { playersID: ["1", "2"], amountOfTeam: 2, nameOfTeam: "Team Gamma", host: true };
    const thunk = createNewTeam(teamData);

    const result = await thunk(dispatch, getState, undefined);

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
    });
    expect(result.type).toBe("createNewTeam/rejected");
    expect(result.payload).toBe("HTTP error! Status: 500");
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

    const teamData: TeamData = { playersID: ["1", "2"], amountOfTeam: 2, nameOfTeam: "Team Epsilon", host: true };
    const thunk = createNewTeam(teamData);

    const result = await thunk(dispatch, getState, undefined);

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_REST_API_URL}team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
    });
    expect(result.type).toBe("createNewTeam/rejected");
    expect(result.payload).toBe("Invalid JSON");
});




