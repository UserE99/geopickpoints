import mongoose from "mongoose";
import { User } from "../../src/model/UserModel";
import { authenticateToken, login, register } from "../../src/services/AuthenticationService";
import jwt from "jsonwebtoken";


process.env.JWT_SECRET = "testsecret"; // Setzt ein Dummy-Secret für JWT

test("soll einen Benutzer erfolgreich einloggen, wenn die Anmeldedaten korrekt sind", async () => {
    // Benutzer in der Datenbank anlegen
    const user = await User.create({
        name: "TestUser",
        password: "securepassword",
        email: "test@test.de",
        emailConfirmed: true, 
    });

    const result = await login("TestUser", "securepassword");

    expect(result).toBeTruthy();
    expect(result.id).toBe(user._id.toString());
    expect(result).toHaveProperty("token"); 
});

test("soll einen Fehler werfen, wenn der Benutzer nicht existiert", async () => {
    await expect(login("NonExistentUser", "password")).rejects.toThrow("User not found");
});

test("soll einen Fehler werfen, wenn das Passwort falsch ist", async () => {
    const user = await User.create({
        name: "TestUser",
        password: "securepassword",
        email: "test@test.de",
        emailConfirmed: true,
    });

    await expect(login("TestUser", "wrongpassword"))
        .rejects.toThrow("Invalid password");
});


test("soll einen Fehler werfen, wenn das Token ungültig oder abgelaufen ist", async () => {
    const invalidToken = "invalidToken123";

    await expect(authenticateToken(invalidToken))
        .rejects.toThrow("Ungültiges oder abgelaufenes Token.");
});

test("soll ein gültiges JWT erfolgreich authentifizieren", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const result = await authenticateToken(token);

    expect(result).toBeTruthy();
});

test("soll einen Fehler werfen, wenn die E-Mail nicht bestätigt ist", async () => {
    await User.create({
        name: "TestUser",
        password: "securepassword",
        email: "test@test.de",
        emailConfirmed: false, // E-Mail nicht bestätigt
    });

    await expect(login("TestUser", "securepassword"))
        .rejects.toThrow("Email not confirmed. Please confirm your email before logging in.");
});

test("soll einen Benutzer erfolgreich registrieren", async () => {
    const result = await register("NeuerUser", "sicheresPasswort123!", "neueruser@example.com");

    expect(result).toBeTruthy();
    expect(result).toHaveProperty("id"); 

    const userInDb = await User.findOne({ name: "NeuerUser" });
    expect(userInDb).not.toBeNull(); 
    expect(userInDb!.name).toBe("NeuerUser"); 
    expect(userInDb!.email).toBe("neueruser@example.com"); 
});

test("soll einen Fehler werfen, wenn JWT_SECRET nicht gesetzt ist (login)", async () => {
    await User.create({
        name: "TestUser",
        password: "securepassword",
        email: "test@test.de",
        emailConfirmed: true,
    });

    delete process.env.JWT_SECRET;

    await expect(login("TestUser", "securepassword"))
        .rejects.toThrow("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");

    process.env.JWT_SECRET = "testsecret";
});


test("soll einen Fehler werfen, wenn ein Benutzer mit diesem Namen bereits existiert", async () => {
    await User.create({
        name: "ExistingUser",
        password: "securepassword",
        email: "existinguser@example.com",
    });

    await expect(register("ExistingUser", "sicheresPasswort123!", "newemail@example.com"))
        .rejects.toThrow("Ein Benutzer mit diesem Namen existiert bereits.");
});
