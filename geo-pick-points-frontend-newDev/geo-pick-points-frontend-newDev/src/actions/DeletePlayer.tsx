import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface TeamData {
    name: string;
    players: string[]
    teamID: string;
}

export interface UnjoinTeamData {
    teamID: string;
    playerID: string;
}

export const unjoinTeamDel = createAsyncThunk(
    "unjoinTeam",
    async (unjoinData: UnjoinTeamData, { rejectWithValue }) => {

        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}team/` + unjoinData.teamID, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ playerID: unjoinData.playerID, action: "remove" }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);