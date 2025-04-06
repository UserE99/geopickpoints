import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");

        if (token) {
            // Anfrage an die Backend-API senden
            axios.post(`${process.env.REACT_APP_REST_API_URL}user/verify-email`, { token })
                .then(response => {
                    alert("E-Mail erfolgreich bestätigt!");
                    navigate("/verifyThankYou"); // Weiterleitung zur Login-Seite
                })
                .catch(error => {
                    alert("Fehler bei der E-Mail-Verifizierung: " + error.response?.data?.message || "Unbekannter Fehler");
                });
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>E-Mail-Verifizierung</h1>
            <p>Ihre E-Mail-Adresse wird überprüft...</p>
        </div>
    );
};

export default VerifyEmailPage;
