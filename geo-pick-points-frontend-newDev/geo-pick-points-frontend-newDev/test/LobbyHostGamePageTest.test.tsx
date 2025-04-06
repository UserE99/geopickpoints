
import React, { act } from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LobbyHostGamePage from "../src/Pages/LobbyHostGamePage";
import { Provider, useDispatch } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { useGameStatus } from "../src/utils/GameStatusContext";
import { TextEncoder, TextDecoder } from 'util';
import { joinInTeam, unjoinTeam } from '../src/actions/JoinTeamGame';
import * as WebSocketSetup from '../src/utils/WebSocketSetup';


global.fetch = jest.fn(() =>
    Promise.resolve(
        new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    )
) as jest.Mock;

jest.mock("../src/actions/JoinTeamGame", () => {
    const actualModule = jest.requireActual("../src/actions/JoinTeamGame");

    return {
        ...actualModule,
        joinInTeam: Object.assign(jest.fn(), actualModule.joinInTeam),
    };
});

// Mock Redux Store
const mockStore = configureStore([]);

jest.mock("../src/utils/GameStatusContext", () => ({
    useGameStatus: jest.fn(),
}));

jest.mock("../src/utils/WebSocketSetup", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        messages: [],
        sendMessage: jest.fn(),
    })),
}));

jest.mock("../src/actions/JoinTeamGame", () => ({
    joinInTeam: jest.fn(),
    unjoinTeam: jest.fn(),
}));

jest.mock("../src/actions/CreateGameInstance", () => ({
    createGameInstance: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
}));

describe("LobbyHostGamePage Component", () => {

    let store;
    let mockDispatch;

    beforeEach(() => {
        store = mockStore({
            teams: [],
        });
        store.dispatch = jest.fn();

        mockDispatch = jest.fn();
        const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
        mockUseDispatch.mockReturnValue(mockDispatch);

        (useGameStatus as jest.Mock).mockReturnValue({
            isGameStarted: false,
            setIsGameStarted: jest.fn(),
        });
    });


    it("renders LobbyHostGamePage correctly and matches snapshot", async () => {
        const { asFragment } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <LobbyHostGamePage />
                </MemoryRouter>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("displays the correct header and team list when data is present", async () => {
        const mockDataTeam = [
            {
                _id: "team1",
                name: "Team Alpha",
                players: [{ nickName: "Player 1", id: "player1", name: "John Doe" }],
                codeInvite: "abc123",
                shareUrl: "http://example.com/invite",
                qaCode: "http://example.com/qrcode",
                playersIDData: "data",
            },
        ];

        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            json: async () => mockDataTeam,
            ok: true,
        } as any);

        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <LobbyHostGamePage />
                    </MemoryRouter>
                </Provider>
            );
        });

        expect(screen.getByText("Your Lobby Host")).toBeInTheDocument();
        expect(screen.getByText("List of your Teams")).toBeInTheDocument();
        expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    });


    it('displays an error message if fetching team data fails', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch team data'));

        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <LobbyHostGamePage />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            expect(screen.queryByText(/No teams available/i)).toBeTruthy();
        });


        global.fetch.mockRestore();
    });

    it('handles joining and leaving a team', async () => {
        const store = mockStore({
            gameStatus: { isGameStarted: false },
            playerTeamInfo: { teamId: null, nickName: null },
        });


        // Dispatch als Mock-Funktion setzen
        store.dispatch = jest.fn();
        const mockSendMessage = jest.fn();
        (WebSocketSetup.default as jest.Mock).mockReturnValue({
            messages: [],
            sendMessage: mockSendMessage,
        });
        const mockTeamData = [
            {
                _id: 'team1',
                name: 'Team One',
                shortName: 'T1',
                players: [
                    { nickName: 'TestPlayer', playerId: '1234' },
                ],
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => mockTeamData,
        } as any);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LobbyHostGamePage />
                </MemoryRouter>
            </Provider>
        );

        // Warte auf das Laden der Teams
        await waitFor(() => expect(screen.getByText(/List of your Teams/i)).toBeInTheDocument());

        // Verifiziere den Host-Namen
        const hostNameContainer = screen.getByText(/Host Name :/i).closest('h5');

        // "Join Team" Button klicken
        const joinButton = await screen.findByRole('button', { name: /Join Team/i });
        fireEvent.click(joinButton);

        expect(mockSendMessage).toHaveBeenCalledWith({
            playerId: undefined,
            playerName: undefined,
            teamId: "team1",
            type: "join"

        });

        // Stelle sicher, dass der "Leave Team" Button sichtbar wird
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Leave Team/i })).toBeInTheDocument();
        });

        // Simuliere Klick auf "Leave Team"
        const leaveButton = screen.getByRole('button', { name: /Leave Team/i });
        fireEvent.click(leaveButton);

        // Überprüfe, ob mockSendMessage für "leave" aufgerufen wurde
        expect(mockSendMessage).toHaveBeenCalledWith({
            type: 'leave',
            playerId: '1234',
            playerName: 'TestPlayer',
            teamId: 'team1',
        });

        // API-Mocks zurücksetzen
        global.fetch.mockRestore();
    });



    it("handles the start game functionality", async () => {
        const mockDataTeam = [
            {
                _id: "team1",
                name: "Team Alpha",
                players: [{ nickName: "TestPlayer", id: "player1", name: "John Doe" }],
                codeInvite: "abc123",
                shareUrl: "http://example.com/invite",
                qaCode: "http://example.com/qrcode",
                playersIDData: "data",
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => mockDataTeam,
        } as any);


        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <LobbyHostGamePage />
                    </MemoryRouter>
                </Provider>
            );
        });

        expect(screen.getByText("TestPlayer (Your)")).toBeInTheDocument();

        const startGameButton = screen.getByText("Start Game!");
        fireEvent.click(startGameButton);

        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});  
