
import React from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit";

const REACT_APP_REST_API_URL = process.env.REACT_APP_REST_API_URL;

export interface userData {
    id: string;
    name: string;
    email: string;

}

export const updateUser = createAsyncThunk(
    "updateUser",
    async (userData: userData, { rejectWithValue }) => {

        try {
            const response = await fetch(`${REACT_APP_REST_API_URL}user/${userData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export interface UserPasswordData {
    id: string;
    currentPassword: string;
    newPassword: string;
}

export interface APIResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const updateUserPassword = createAsyncThunk(
    "updateUserPassword",
    async (userPasswordData: UserPasswordData, { rejectWithValue }) => {

        if (!userPasswordData.id || !userPasswordData.newPassword) {
            return rejectWithValue("Invalid user password data.");
        }
        console.log("userPasswordData.....", userPasswordData);
        try {
            const response = await fetch(`${process.env.REACT_APP_REST_API_URL}user/${userPasswordData.id}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: userPasswordData.currentPassword,
                    newPassword: userPasswordData.newPassword,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody?.message || `HTTP error! Status: ${response.status}`);
            }

            const data: APIResponse = await response.json();
            console.log("data from backend after update.....++++", data);
            return data;
        } catch (error: any) {
            console.error("Error updating user password:", error.message);
            return rejectWithValue({
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
);