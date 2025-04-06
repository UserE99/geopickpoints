import { authentication } from "../src/actions/Authentication";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import type { Middleware } from "redux";

const mockFetch = (response: any, ok = true) => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve("Invalid credentials"),
        })
    ) as jest.Mock;
};

describe("authentication async thunk", () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: () => ({}),
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(thunk as Middleware),
        });
    });

    test("dispatches fulfilled action when login succeeds", async () => {
        mockFetch({ token: "mockToken", user: { id: "123", name: "testuser" } });

        const resultAction = await store.dispatch(authentication({ name: "testuser", password: "password123" }));
        const result = resultAction as any;

        expect(result.type).toBe("authentication/fulfilled");
        expect(result.payload).toEqual({ token: "mockToken", user: { id: "123", name: "testuser" } });
    });

    test("dispatches rejected action when login fails", async () => {
        mockFetch({}, false);

        const resultAction = await store.dispatch(authentication({ name: "wronguser", password: "wrongpass" }));
        const result = resultAction as any;

        expect(result.type).toBe("authentication/rejected");
        expect(result.payload).toBe("Invalid credentials");
    });

    test("dispatches rejected action when network error occurs", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

        const resultAction = await store.dispatch(authentication({ name: "testuser", password: "password123" }));
        const result = resultAction as any;

        expect(result.type).toBe("authentication/rejected");
        expect(result.payload).toBe("Fehler beim Login");
    });
});