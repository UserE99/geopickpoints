import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { login } from "../services/AuthenticationService";

/**
 * Überprüft Passwort und erstellt ein JWT, falls erfolgreich.
 */
export async function verifyPasswordAndCreateJWT(name: string, password: string): Promise<string | undefined> {
    const secret = process.env.JWT_SECRET;
    const ttl = process.env.JWT_TTL || "1h"; // Standardwert für TTL (1 Stunde)

    if (!secret) {
        throw new Error("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");
    }

    const user = await login(name, password);
    if (!user) {
        return undefined; // Login fehlgeschlagen
    }

    const payload = {
        sub: user.id, // Benutzer-ID
    };

    const jwtString = sign(payload, secret, {
        expiresIn: ttl,
        algorithm: "HS256",
    });

    return jwtString;
}

/**
 * Verifiziert ein JWT und gibt die Benutzerinformationen zurück.
 */
export function verifyJWT(jwtString: string | undefined): { id: string; exp: number | undefined } {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");
    }

    if (!jwtString) {
        throw new JsonWebTokenError("JWT ist nicht definiert.");
    }

    try {
        const payload = verify(jwtString, secret) as any;
        return {
            id: payload.sub,
            exp: payload.exp,
        };
    } catch (err) {
        throw new JsonWebTokenError("JWT-Überprüfung fehlgeschlagen.");
    }
}

/**
 * Erstellt ein temporäres JWT für E-Mail-Bestätigung oder Passwort-Reset.
 * @param userId - Die ID des Benutzers
 * @param expiresIn - Ablaufzeit des Tokens (z. B. "1h", "7d")
 * @returns Das generierte JWT-Token
 */
export function createTemporaryJWT(userId: string, expiresIn: string = "1h"): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");
    }

    // Payload für das temporäre Token
    const payload = {
        id: userId,
    };

    // Token generieren
    return sign(payload, secret, {
        expiresIn,
        algorithm: "HS256",
    });
}