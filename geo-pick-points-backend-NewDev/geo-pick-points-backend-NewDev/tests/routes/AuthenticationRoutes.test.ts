import supertest from "supertest";
import app from "../../src/app"; 
import { User } from "../../src/model/UserModel";

const request = supertest(app);

afterEach(async () => {
    await User.deleteMany({});
});

test("POST /api/login - Erfolgreiches und fehlerhaftes Login", async () => {
    process.env.JWT_SECRET = "testsecret";

    await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: true,
    });

    const response1 = await request.post("/api/authenticate/login").send({
        name: "testuser",
        password: "securepassword",
    });

    expect(response1.statusCode).toBe(200);
    expect(response1.body).toHaveProperty("id"); 
    expect(response1.body).toHaveProperty("token"); 


});


test("POST /api/login - E-Mail nicht bestätigt", async () => {
    await User.create({
        name: "testuser",
        password: "securepassword",
        email: "testuser@example.com",
        emailConfirmed: false, 
    });

    const response = await request.post("/api/authenticate/login").send({
        name: "testuser",
        password: "securepassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe("Email not confirmed. Please confirm your email before logging in.");
});

test("POST /api/login - Server-Fehlerbehandlung", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
        throw new Error("Datenbankfehler");
    });

    const response = await request.post("/api/authenticate/login").send({
        name: "testuser",
        password: "securepassword",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe("Datenbankfehler");

    jest.restoreAllMocks();
});
