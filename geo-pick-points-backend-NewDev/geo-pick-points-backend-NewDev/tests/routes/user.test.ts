import supertest from 'supertest';
import app from '../../src/app';
import { User } from '../../src/model/UserModel';

const request = supertest(app);

afterEach(async () => {
    await User.deleteMany({});
});

test("POST /api/user - Create User", async () => {
    const newUser = { name: "emir", password: "password123", email: "emir@example.com" };

    const response = await request.post("/api/user").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body).toHaveProperty("createdAt");
});

test("POST /api/user - Create User with existing name", async () => {
    const newUser = { name: "emir", password: "password123", email: "emir@example.com" };

    // Benutzer erstellen
    await User.create(newUser);

    const response = await request.post("/api/user").send(newUser);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler beim Erstellen des Benutzers");
    expect(response.body.Error).toContain("already exists");
});

test("DELETE /api/user/:id - Löschen von einem User", async () => {
    const user = await User.create({ name: "emir", password: "securepassword", email: "emir@example.com" });

    const response = await request.delete(`/api/user/${user._id}`).send();

    expect(response.statusCode).toBe(204);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
});

test("DELETE /api/user/:id - Delete nicht existenten user", async () => {
    const nonExistentId = "012345678901234567890123"; // Gültiges MongoDB-Objekt-ID-Format

    const response = await request.delete(`/api/user/${nonExistentId}`).send();

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Benutzer nicht gefunden");
});

test("GET /api/user/:id - Get User funktioniert", async () => {
    const user = await User.create({ name: "emir", password: "securepassword", email: "emir@example.com" });

    const response = await request.get(`/api/user/${user._id}`).send();

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.name);
    expect(response.body.password).toBe(user.password);
    //expect(response.body.email).toBe(user.email);
});

test("GET /api/user/:id - Fehler beim Abrufen des Benutzers", async () => {
    const nonExistentId = "001234567891234567891234";

    const response = await request.get(`/api/user/${nonExistentId}`).send();

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler beim Abrufen des Benutzers");
});

test("POST /api/user/verify-email - Verify email mit aktivem Token", async () => {
    const user = await User.create({
        name: "emir",
        password: "password123",
        email: "emir@example.com",
        verificationToken: "validToken123",
        emailConfirmed: false,
    });

    const response = await request.post("/api/user/verify-email").send({ token: "validToken123" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("E-Mail erfolgreich bestätigt!");

    const verifiedUser = await User.findById(user._id);
    expect(verifiedUser).not.toBeNull();
    expect(verifiedUser!.emailConfirmed).toBe(true);
    expect(verifiedUser!.verificationToken).toBeNull();
});

test("POST /api/user/verify-email - Verify email mit falschem Token", async () => {
    const response = await request.post("/api/user/verify-email").send({ token: "invalidToken123" });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler bei der E-Mail-Verifizierung.");
});

test("POST /api/user/verify-email - Verify email mit abgelaufenem Token", async () => {
    await User.create({
        name: "Emir",
        password: "securepassword",
        email: "emir@example.com",
        verificationToken: "expiredToken123",
        verificationTokenExpiration: new Date(Date.now() - 3600 * 1000), // Token abgelaufen
        emailConfirmed: false,
    });

    const response = await request.post("/api/user/verify-email").send({ token: "expiredToken123" });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler bei der E-Mail-Verifizierung.");
});

test("DELETE /api/user/:id - Fehler beim Löschen des Benutzers", async () => {
    jest.spyOn(User, "findByIdAndDelete").mockImplementationOnce(() => {
        throw new Error("Datenbankfehler");
    });

    const userId = "012345678901234567890123"; 

    const response = await request.delete(`/api/user/${userId}`).send();

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler beim Löschen des Benutzers");

    jest.restoreAllMocks();
});

test("POST /api/user - sollte 500 zurückgeben, wenn der Benutzer bereits existiert", async () => {
    await User.create({ name: "Emir", password: "password123", email: "test@test.de" });

    const response = await request.post("/api/user").send({
        name: "Emir",
        password: "password456",
        email: "test2@test.de"
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Fehler beim Erstellen des Benutzers");
    expect(response.body.Error).toBe("name Emir already exists. Please input a new one.");
});
