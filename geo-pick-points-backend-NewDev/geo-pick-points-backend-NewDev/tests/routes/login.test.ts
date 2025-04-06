import supertest from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/UserModel";

const request = supertest(app);

afterEach(async () => {
    await User.deleteMany({});
});

test("POST /api/login - Erfolgreiches Login", async () => {
    process.env.JWT_SECRET = "testsecret";

    const user = await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: true,
    });

    const response = await request.post("/api/login").send({
        name: "testuser",
        password: "securepassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", user._id.toString());
    expect(response.body).toHaveProperty("exp"); 
});

test("POST /api/login - Fehler: Benutzername nicht gefunden", async () => {
    const response = await request.post("/api/login").send({
        name: "nonexistentuser",
        password: "password123",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Login fehlgeschlagen");
});

test("POST /api/login - Fehler: Falsches Passwort", async () => {
    await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: true,
    });

    const response = await request.post("/api/login").send({
        name: "testuser",
        password: "wrongpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Login fehlgeschlagen");
});

test("POST /api/login - Fehler: E-Mail nicht bestätigt", async () => {
    await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: false,
    });

    const response = await request.post("/api/login").send({
        name: "testuser",
        password: "securepassword",
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Email not confirmed. Please confirm your email before logging in.");
});

test("GET /api/login - Erfolgreiche Überprüfung des Logins", async () => {
    process.env.JWT_SECRET = "testsecret";

    const user = await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: true,
    });

    const loginResponse = await request.post("/api/login").send({
        name: "testuser",
        password: "securepassword",
    });

    const token = loginResponse.headers["set-cookie"]?.[0]?.split(";")[0]?.split("=")[1];

    const response = await request
        .get("/api/login")
        .set("Cookie", [`access_token=${token}`])
        .send();


    expect(response.statusCode).toBe(200);
});




test("GET /api/login - Login nicht möglich ohne Token", async () => {
    const response = await request.get("/api/login").send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(false);
});

test("DELETE /api/login - Erfolgreiches Logout", async () => {
    const user = await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: true,
    });

    const loginResponse = await request.post("/api/login").send({
        name: "testuser",
        password: "securepassword",
    });

    const token = loginResponse.headers["set-cookie"]?.[0]?.split(";")[0]?.split("=")[1];

    const response = await request.delete("/api/login").set("Cookie", [`access_token=${token}`]).send();

    expect(response.statusCode).toBe(204);
});

test("DELETE /api/login - Logout ohne Token", async () => {
    const response = await request.delete("/api/login").send();

    expect(response.statusCode).toBe(204); 
});
