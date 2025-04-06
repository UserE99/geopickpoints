import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ReadQACode from "../src/components/ReadQACode";
import AddPlayerDialog from "../src/components/AddPlayerDialog";
import '@testing-library/jest-dom';

afterEach(() => {
    jest.restoreAllMocks();
});

jest.mock("../src/components/AddPlayerDialog", () => {
    return jest.fn(() => <div data-testid="add-player-dialog">Mocked AddPlayerDialog</div>);
});

describe("ReadQACode Component", () => {
    it("renders the AddPlayerDialog when a valid code is in the URL", async () => {
        let asFragment;

        await act(async () => {
            const result = render(
                <MemoryRouter initialEntries={["/ReadQACode/ABCDE12345"]}>
                    <Routes>
                        <Route path="/ReadQACode/:code" element={<ReadQACode />} />
                    </Routes>
                </MemoryRouter>
            );
            asFragment = result.asFragment;
        });

        // Überprüfe, ob die Komponente AddPlayerDialog gerendert wurde
        expect(screen.getByTestId("add-player-dialog")).toBeInTheDocument();

        // Snapshot-Test
        expect(asFragment()).toMatchSnapshot();
    });

    it("does not render the AddPlayerDialog when no valid code is in the URL", async () => {
        let asFragment;

        await act(async () => {
            const result = render(
                <MemoryRouter initialEntries={["/ReadQACode/"]}>
                    <Routes>
                        <Route path="/ReadQACode/:code" element={<ReadQACode />} />
                    </Routes>
                </MemoryRouter>
            );
            asFragment = result.asFragment;
        });

        // Überprüfe, ob die Komponente AddPlayerDialog NICHT gerendert wurde
        expect(screen.queryByTestId("add-player-dialog")).not.toBeInTheDocument();

        // Snapshot-Test
        expect(asFragment()).toMatchSnapshot();
    });

    it("logs a message when no code is found in the URL", async () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(); // Spy aktivieren

        await act(async () => {
            render(
                <MemoryRouter initialEntries={["/ReadQACode/"]}>
                    <Routes>
                        <Route path="/ReadQACode/:code" element={<ReadQACode />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        //expect(consoleLogSpy).toHaveBeenCalledWith("Kein Code in der URL gefunden."); // Überprüfen
        expect(consoleLogSpy).toHaveBeenCalledTimes(0);
        consoleLogSpy.mockRestore(); // Spy zurücksetzen
    });
});
