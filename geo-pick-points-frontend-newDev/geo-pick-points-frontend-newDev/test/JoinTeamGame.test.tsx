import { joinInTeam, unjoinTeam, TeamData, UnjoinTeamData } from "../src/actions/JoinTeamGame";
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';

// Initialisiere fetchMock
fetchMock.enableMocks();

// Testdaten
const teamData: TeamData = {
    nickName: "Team A",
    playerID: "123",
    teamId: "T001"
};

const unjoinData: UnjoinTeamData = {
    teamId: "T001",
    playerID: "123"
};

// Mock für den Store
const createTestStore = () => {
    return configureStore({
        reducer: {

        },

    });
};

describe("joinInTeam Thunk", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("should successfully join a team", async () => {
        // Mock einer erfolgreichen Antwort
        fetchMock.mockResponseOnce(
            JSON.stringify({ success: true, data: teamData }),
            { status: 200 }
        );

        const store = createTestStore();

        // Aufruf des Thunks
        const result = await store.dispatch(joinInTeam(teamData));

        expect(result.type).toBe("joinInTeam/fulfilled");
        expect(result.payload).toEqual({ success: true, data: teamData });

        // Snapshot testen
        expect(result).toMatchSnapshot();
    });

    it("should handle error when joining team", async () => {
        // Mock einer fehlgeschlagenen Antwort
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Failed to join team" }),
            { status: 400 }
        );

        const store = createTestStore();

        // Aufruf des Thunks
        const result = await store.dispatch(joinInTeam(teamData));

        expect(result.type).toBe("joinInTeam/rejected");
        expect(result.error.message).toBe("Rejected");

        // Snapshot testen
        expect(result).toMatchSnapshot();
    });
});

describe("unjoinTeam Thunk", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("should successfully unjoin a team", async () => {
        // Mock einer erfolgreichen Antwort
        fetchMock.mockResponseOnce(
            JSON.stringify({ success: true }),
            { status: 200 }
        );

        const store = createTestStore();

        // Aufruf des Thunks
        const result = await store.dispatch(unjoinTeam(unjoinData));

        expect(result.type).toBe("unjoinTeam/fulfilled");
        expect(result.payload).toEqual({ success: true });

        // Snapshot testen
        expect(result).toMatchSnapshot();
    });

    it("should handle error when unjoining team", async () => {
        // Mock einer fehlgeschlagenen Antwort
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Failed to unjoin team" }),
            { status: 400 }
        );

        const store = createTestStore();

        // Aufruf des Thunks
        const result = await store.dispatch(unjoinTeam(unjoinData));

        expect(result.type).toBe("unjoinTeam/rejected");
        expect(result.error.message).toBe("Rejected");

        // Snapshot testen
        expect(result).toMatchSnapshot();
    });
});

