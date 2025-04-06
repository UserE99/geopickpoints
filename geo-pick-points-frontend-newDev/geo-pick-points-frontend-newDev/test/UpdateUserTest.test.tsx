import { createSlice } from '@reduxjs/toolkit';
import { updateUser, updateUserPassword, userData, UserPasswordData } from '../src/actions/UpdateUser';
import fetchMock from 'jest-fetch-mock';
import configureStore from 'redux-mock-store';

// Initialisiere Fetch Mock
fetchMock.enableMocks();

describe('Thunk actions', () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    // Test für `updateUser`
    it('should successfully update user data and return the response', async () => {
        const mockResponse = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        };

        // Setze das Mock für den erfolgreichen API-Aufruf
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const user: userData = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        };


        const dispatch = jest.fn();
        const result = await updateUser(user);
        console.log("result....: ", result);
        // Überprüfe ob der Dispatch und der Rückgabewert korrekt sind
        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            `${process.env.REACT_APP_REST_API_URL}user/${user.id}`,
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify(user),
            })
        );
    });

    // Test für `updateUserPassword`
    it('should successfully update user password and return the response', async () => {
        const mockPasswordResponse = {
            success: true,
            message: 'Password updated successfully',
        };

        // Setze das Mock für den erfolgreichen Passwort-Update-API-Aufruf
        fetchMock.mockResponseOnce(JSON.stringify(mockPasswordResponse), { status: 200 });

        const passwordData: UserPasswordData = {
            id: '123',
            currentPassword: 'oldPassword',
            newPassword: 'newPassword',
        };

        const dispatch = jest.fn();
        const result = await updateUserPassword(passwordData, { dispatch, rejectWithValue: jest.fn() });

        // Überprüfe ob der Dispatch und der Rückgabewert korrekt sind
        expect(result.payload).toEqual(mockPasswordResponse);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            `${process.env.REACT_APP_REST_API_URL}user/${passwordData.id}/password`,
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })
        );
    });

    // Test für Fehlerbehandlung bei `updateUser`
    it('should handle error when updating user data', async () => {
        const errorMessage = 'HTTP error! Status: 500';
        fetchMock.mockRejectOnce(new Error(errorMessage));

        const user: userData = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        };

        const dispatch = jest.fn();
        const result = await updateUser(user);

        expect(result.payload).toBe(errorMessage);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Test für Fehlerbehandlung bei `updateUserPassword`
    it('should handle error when updating user password', async () => {
        const errorMessage = 'Password update failed';
        fetchMock.mockRejectOnce(new Error(errorMessage));

        const passwordData: UserPasswordData = {
            id: '123',
            currentPassword: 'oldPassword',
            newPassword: 'newPassword',
        };

        const dispatch = jest.fn();
        const result = await updateUserPassword(passwordData, { dispatch, rejectWithValue: jest.fn() });

        expect(result.payload.message).toBe(errorMessage);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Test für Snapshot von `updateUser`
    it('should match snapshot for updateUser success response', async () => {
        const mockResponse = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const user: userData = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        };

        const dispatch = jest.fn();
        const result = await updateUser(user);

        expect(result.payload).toMatchSnapshot();
    });

    // Test für Snapshot von `updateUserPassword`
    it('should match snapshot for updateUserPassword success response', async () => {
        const mockPasswordResponse = {
            success: true,
            message: 'Password updated successfully',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockPasswordResponse), { status: 200 });

        const passwordData: UserPasswordData = {
            id: '123',
            currentPassword: 'oldPassword',
            newPassword: 'newPassword',
        };

        const dispatch = jest.fn();
        const result = await updateUserPassword(passwordData, { dispatch, rejectWithValue: jest.fn() });

        expect(result.payload).toMatchSnapshot();
    });
});
