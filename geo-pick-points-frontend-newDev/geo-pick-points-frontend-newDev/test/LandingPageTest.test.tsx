import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPage from '../src/Pages/LandingPage';
import { useAppDispatch } from '../src/store';
import "@testing-library/jest-dom";
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShowNameDialogInput from '../src/components/ShowNameDialogInput';
import HostGame from "../src/components/GameStartButton";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
// Konfiguriere den Mock-Store
const mockStore = configureStore();
let store = mockStore({

    player: { id: '123' },

});
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
    useSearchParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../src/actions/CreateNewPlayer', () => ({
    createNewPlayer: jest.fn(),
}));

jest.mock('../src/store', () => ({
    useAppDispatch: jest.fn(),
}));

describe('LandingPage', () => {
    let dispatch: jest.Mock;
    let navigate: jest.Mock;

    beforeEach(() => {
        navigate = useNavigate() as jest.Mock;
        // Mocke `useSearchParams` mit einem Standardwert
        (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), jest.fn()]);
    });

    test('should show name input when Host Game is clicked', async () => {
        store = mockStore({
            authentication: {
                authen: {
                    isLoggedIn: false, // initialer Zustand
                },
            },
        });

        // Rendern der LandingPage
        const { asFragment } = render(
            <Provider store={store}>
                <LandingPage />
            </Provider>
        );

        // Klicke auf den "Host Game"-Button und warte auf das Vorhandensein der Schaltfläche
        const hostButton = await screen.findByText('Host Game');
        fireEvent.click(hostButton);

        expect(screen.getByTestId('DialogNameInput')).toBeInTheDocument();
        // Gib einen Nickname ein
        fireEvent.change(screen.getByTestId('nameInput'), { target: { value: 'Player1' } });

        fireEvent.click(screen.getByTestId('saveButton'));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'player/createNewPlayer',
                    payload: { nickName: 'Player1', host: true },
                })
            );
        });

        // Snapshot erstellen
        expect(asFragment()).toMatchSnapshot();
    });

    test('should show name input when Join Game is clicked', async () => {
        store = mockStore({
            authentication: {
                authen: {
                    isLoggedIn: false,
                },
            },
        });

        // Rendern der LandingPage
        const { asFragment } = render(
            <Provider store={store}>
                <LandingPage />
            </Provider>
        );
        await waitFor(() => expect(screen.getByText(/Join Game/i)).toBeInTheDocument());

        // Klicke auf den "Join Game"-Button
        const joinButton = await screen.findByText('Join Game');
        fireEvent.click(joinButton);

        expect(screen.getByTestId('DialogNameInput')).toBeInTheDocument();
        // Gib einen Nickname ein
        fireEvent.change(screen.getByTestId('nameInput'), { target: { value: 'Player1' } });

        fireEvent.click(screen.getByTestId('saveButton'));


        // Warte darauf, dass die Navigation aufgerufen wird
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/game', {
                state: { nickName: 'Player1', host: false, playerID: '123' },
            });
        });

        // Snapshot erstellen
        expect(asFragment()).toMatchSnapshot();
    });

    test('should alert when no nickname is provided', async () => {
        // Spioniere den globalen `alert`-Funktionsaufruf ab
        const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => { });

        // Rendern der LandingPage
        const { asFragment } = render(<LandingPage />);

        // Klicke auf den "Host Game"-Button
        fireEvent.click(screen.getByText('Host Game'));

        // Klicke auf den "Save"-Button ohne Nickname
        fireEvent.click(screen.getByText('Save'));

        // Überprüfe, ob der Alert gezeigt wird
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid namen .');

        // Snapshot erstellen
        expect(asFragment()).toMatchSnapshot();

        // Rückgängig machen des Spionierens
        alertSpy.mockRestore();
    });
});
