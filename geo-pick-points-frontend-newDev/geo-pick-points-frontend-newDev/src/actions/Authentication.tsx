import { createAsyncThunk } from '@reduxjs/toolkit';

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

interface AuthenticationResponse {
    token: string;
    user: {
        id: string;
        name: string;
    };
}

interface AuthenticationPayload {
    name: string;
    password: string;
}

export const authentication = createAsyncThunk<
    AuthenticationResponse,
    AuthenticationPayload,
    { rejectValue: string }
>(
    'authentication',
    async ({ name, password }: AuthenticationPayload, { rejectWithValue }) => {
        try {
            //authenticate    
            const response = await fetch(`${REACT_APP_REST_API_URL}authenticate/login`, {
                method: 'POST',
                body: JSON.stringify({ name, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const error = await response.text();
                return rejectWithValue(error);
            }

            const data = await response.json();
            return { token: data.token, user: data.user };
        } catch (error) {
            return rejectWithValue('Fehler beim Login');
        }
    }
);
