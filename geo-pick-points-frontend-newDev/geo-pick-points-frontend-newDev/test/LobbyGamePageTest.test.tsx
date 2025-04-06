import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import "@testing-library/jest-dom";
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LobbyGamePage from '../src/Pages/LobbyGamePage';
import * as WebSocketSetup from '../src/utils/WebSocketSetup';
import fetchMock from "jest-fetch-mock";
import { thunk } from 'redux-thunk';
import { joinInTeam } from '../src/actions/JoinTeamGame';

fetchMock.enableMocks();


jest.mock('../src/utils/WebSocketSetup', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        messages: [],
        sendMessage: jest.fn(),
    })),
}));

const mockStore = configureStore([]);
const mockedLocationState = {
    state: {
        nickName: 'TestPlayer',
        playerID: '1234',
        codeInvite: 'testCode',
        teamID: null,
    },
};

jest.mock("../src/actions/JoinTeamGame", () => {
    const actualModule = jest.requireActual("../src/actions/JoinTeamGame");

    return {
        ...actualModule,
        joinInTeam: Object.assign(jest.fn(), actualModule.joinInTeam),
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

describe('LobbyGamePage', () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore({
            gameStatus: { isGameStarted: false },
        });
        (useLocation as jest.Mock).mockReturnValue(mockedLocationState);
    });

    it('renders the LobbyGamePage component and matches snapshot', async () => {
        const { asFragment } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <LobbyGamePage />
                </MemoryRouter>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('displays the loading state initially', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        } as Response);

        store = mockStore({
            teams: null,
            gameStatus: { isGameStarted: false },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LobbyGamePage />
                </MemoryRouter>
            </Provider>
        );


        expect(screen.getByText((_, element) => {
            const hasText = (text: string) => text.includes("Loading teams...");
            const childrenDontHaveText = Array.from(element?.children || []).every(
                (child) => !hasText(child.textContent || "")
            );
            return hasText(element?.textContent || "") && childrenDontHaveText;
        })).toBeInTheDocument();
    });


    it('displays an error message if fetching team data fails', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch team data'));

        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <LobbyGamePage />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/Could not load teams. Please try again./i)).toBeInTheDocument();
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
        } as Response);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LobbyGamePage />
                </MemoryRouter>
            </Provider>
        );

        // Wait for the teams to load
        await waitFor(() => expect(screen.getByText(/Select your Teams/i)).toBeInTheDocument());
        // Verify the Host Name
        const hostNameContainer = screen.getByText(/Host Name :/i).closest('h5');
        expect(
            within(hostNameContainer ?? document.createElement('div')).getByText(/TestPlayer/i)
        ).toBeInTheDocument();
        // "Join Team" Button klicken
        const joinButton = await screen.findByRole('button', { name: /Join Team/i });
        fireEvent.click(joinButton);
        console.log("Button clicked!");

        // Prüfen, ob `dispatch` nach dem Klick aufgerufen wurde
        console.log("Dispatched Actions nach Click:", store.getActions());

        // Überprüfe, ob `store.dispatch` aufgerufen wurde
        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: joinInTeam.pending.type,  //  hier wird joinInTeam.pending.type verwendet
                payload: { teamId: 'team1', nickName: 'TestPlayer' },
            }));
        });


        // Hol  alle Dispatch-Aktionen
        const actions = store.getActions();
        expect(actions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: joinInTeam.fulfilled.type, // Redux Toolkit Action-Type
                    payload: { teamId: 'team1', nickName: 'TestPlayer' },
                }),
            ])
        );

        // Stelle sicher, dass "Leave Team" Button sichtbar wird
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Leave Team/i })).toBeInTheDocument();
        });

        // Simuliere Klick auf "Leave Team"
        const leaveButton = screen.getByRole('button', { name: /Leave Team/i });
        fireEvent.click(leaveButton);

        // Stelle sicher, dass die korrekten Redux-Aktionen gesendet wurden
        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'LEAVE_TEAM', // Falls eine separate "leave" Action hast
                payload: { teamId: 'team1', nickName: 'TestPlayer' },
            }));
        });

        // Prüfe, ob `mockSendMessage` aufgerufen wurde (WebSocket Nachricht)
        expect(mockSendMessage).toHaveBeenCalledWith({
            type: 'leave',
            playerId: '1234',
            playerName: 'TestPlayer',
            teamId: 'team1',
        });

        // API-Mocks zurücksetzen
        global.fetch.mockRestore();
    });

});
