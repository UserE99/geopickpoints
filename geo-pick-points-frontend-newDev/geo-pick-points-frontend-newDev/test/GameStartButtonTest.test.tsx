import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Für erweiterte Assertions wie toBeInTheDocument()
import GameStartButton from "../src/components/GameStartButton";

describe("GameStartButton Component", () => {
    it("renders correctly and matches snapshot", () => {
        const mockOnClick = jest.fn(); // Mock-Funktion für onClick
        const { asFragment } = render(<GameStartButton onClick={mockOnClick} />);

        // Überprüfe, ob der Button gerendert wird
        const button = screen.getByTestId("GameStartButton");
        expect(button).toBeInTheDocument();

        // Snapshot-Test
        expect(asFragment()).toMatchSnapshot();
    });

    it("triggers onClick callback when clicked", () => {
        const mockOnClick = jest.fn(); // Mock-Funktion für onClick
        render(<GameStartButton onClick={mockOnClick} />);

        // Simuliere einen Klick auf den Button
        const button = screen.getByTestId("GameStartButton");
        fireEvent.click(button);

        // Überprüfe, ob die onClick-Funktion aufgerufen wurde
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("applies styles from environment variables", () => {
        process.env.REACT_APP_COLOR_PRIMARY = "#ffffff";
        process.env.REACT_APP_COLOR_SECONDARY = "#000000";

        render(<GameStartButton onClick={() => { }} />);

        const button = screen.getByTestId("GameStartButton");

        // Überprüfe die angewendeten Styles
        expect(button).toHaveStyle("background-color: #000000");
        expect(button).toHaveStyle("color: #ffffff");
        expect(button).toHaveStyle("border-color: #ffffff");
    });
});
