import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddPlayerDialog from "../../geo-pick-points-frontend/src/components/AddPlayerDialog";
import "@testing-library/jest-dom";

describe("AddPlayerDialog component", () => {
    test("renders the component and triggers the dialog", () => {
        const mockOnPlayerAdded = jest.fn();
        render(
            <MemoryRouter>
                <AddPlayerDialog codeInvite="testCode" onPlayerAdded={mockOnPlayerAdded} />
            </MemoryRouter>
        );

        const buttonElement = document.querySelector("button[hidden]");
        expect(buttonElement).not.toBeNull();

        if (buttonElement) {
            fireEvent.click(buttonElement);
        }
    });

    test("calls onPlayerAdded when a player is added", async () => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({ id: "12345" }),
        } as Response);

        const mockOnPlayerAdded = jest.fn();
        render(
            <MemoryRouter>
                <AddPlayerDialog codeInvite="testCode" onPlayerAdded={mockOnPlayerAdded} />
            </MemoryRouter>
        );

        const inputElement = screen.getByRole("textbox");
        fireEvent.change(inputElement, { target: { value: "TestPlayer" } });

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        await waitFor(() => expect(mockOnPlayerAdded).toHaveBeenCalledWith("TestPlayer", false));

        jest.restoreAllMocks();
    });
});
