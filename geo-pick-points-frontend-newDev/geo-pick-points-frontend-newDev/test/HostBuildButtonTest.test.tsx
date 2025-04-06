import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Für erweiterte Assertions wie toBeInTheDocument()
import HostBuildButton from "../src/components/HostBuildButton";

describe("HostBuildButton Component", () => {
    it("renders correctly and matches snapshot", () => {
        const mockOnClick = jest.fn(); // Mock-Funktion für onClick

        // `act` manuell um render() einhüllen
        let asFragment;
        act(() => {
            const renderResult = render(<HostBuildButton onClick={mockOnClick} />);
            asFragment = renderResult.asFragment;
        });

        // Überprüfe, ob der Button gerendert wird
        const button = screen.getByTestId("HostBuildButton");
        expect(button).toBeInTheDocument();

        // Snapshot-Test
        expect(asFragment()).toMatchSnapshot();
    });

    it("triggers onClick callback when clicked", () => {
        const mockOnClick = jest.fn(); // Mock-Funktion für onClick
        render(<HostBuildButton onClick={mockOnClick} />);

        // Simuliere einen Klick auf den Button
        const button = screen.getByTestId("HostBuildButton");
        fireEvent.click(button);

        // Überprüfe, ob die onClick-Funktion aufgerufen wurde
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("applies styles from environment variables", () => {
        // Setze Mock-Werte für Umgebungsvariablen
        process.env.REACT_APP_COLOR_PRIMARY = "#ffffff";
        process.env.REACT_APP_COLOR_SECONDARY = "#000000";

        render(<HostBuildButton onClick={() => { }} />);

        const button = screen.getByTestId("HostBuildButton");

        // Überprüfe die angewendeten Styles
        expect(button).toHaveStyle("background-color: #000000");
        expect(button).toHaveStyle("color: #ffffff");
        expect(button).toHaveStyle("border-color: #ffffff");
    });
});
