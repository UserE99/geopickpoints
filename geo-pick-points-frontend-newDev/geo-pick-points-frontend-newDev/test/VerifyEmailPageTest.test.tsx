import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import VerifyEmailPage from "../src/Pages/VerifyEmailPage";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("axios");

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

test("calls API and navigates on successful verification", async () => {
  (useLocation as jest.Mock).mockReturnValue({
    search: "?token=validToken",
  });

  (axios.post as jest.Mock).mockResolvedValueOnce({ data: { message: "Success" } });

  render(
    <MemoryRouter>
      <VerifyEmailPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_REST_API_URL}user/verify-email`,
      { token: "validToken" }
    );
    expect(mockNavigate).toHaveBeenCalledWith("/verifyThankYou");
  });
});

test("shows an alert on verification failure", async () => {
  global.alert = jest.fn();
  
  (useLocation as jest.Mock).mockReturnValue({
    search: "?token=invalidToken",
  });

  (axios.post as jest.Mock).mockRejectedValueOnce({
    response: { data: { message: "Invalid token" } },
  });

  render(
    <MemoryRouter>
      <VerifyEmailPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_REST_API_URL}user/verify-email`,
      { token: "invalidToken" }
    );
    expect(global.alert).toHaveBeenCalledWith("Fehler bei der E-Mail-Verifizierung: Invalid token");
  });
});
