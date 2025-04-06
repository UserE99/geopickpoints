import { createUser, deleteUser, getUserById, getUserByName, verifyEmail } from "../../src/services/UserService";
import { User } from "../../src/model/UserModel";
import { UserResource } from "../../src/Resources";
import { Types } from "mongoose";
import nodemailer from "nodemailer";

jest.setTimeout(30000);
jest.mock("nodemailer");
afterEach(async () => {
    await User.deleteMany({});
});

test("Create User", async () => {
    // Mocking von nodemailer
    const sendMailMock = jest.fn().mockResolvedValue({
        messageId: "mocked-message-id",
    });

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: sendMailMock,
        verify: jest.fn().mockResolvedValue(true), 
    });

    const userData: UserResource = {
        name: "Emir",
        password: "password123",
        createdAt: new Date(),
        email: "test@test.de",
    };

    const createdUser = await createUser(userData);

    expect(createdUser).toBeTruthy();
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.password).not.toBe(userData.password); 
    expect(createdUser).toHaveProperty("createdAt");

    const userInDb = await User.findOne({ name: "Emir" });
    expect(userInDb).not.toBeNull();
    expect(userInDb!.email).toBe(userData.email);

});

test("Get User by ID", async () => {
    const user = await User.create({
        name: "Emir",
        password: "securepassword",
        createdAt: new Date(),
        email: "test@test.de",
    });

    const foundUser = await getUserById((user._id as Types.ObjectId).toString());
    expect(foundUser).toBeTruthy();
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.password).toBe(user.password);
    expect(foundUser.createdAt).toStrictEqual(user.createdAt);
});

test("Delete User by ID", async () => {
    const user = await User.create({
        name: "Emir",
        password: "anotherpassword",
        createdAt: new Date(),
        email: "test@test.de",
    });

    const userId = (user._id as Types.ObjectId).toString();

    await deleteUser(userId);
    const deletedUser = await User.findById(userId);
    expect(deletedUser).toBeNull();
});

test("Email wird gesendet simulation", async () => {
    const sendMailMock = jest.fn().mockResolvedValue({
        messageId: "test-message-id", // Mocke die `messageId`
    });

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: sendMailMock,
        verify: jest.fn().mockResolvedValue(true),
    });

    const userData: UserResource = {
        name: "Emir",
        password: "password123",
        createdAt: new Date(),
        email: "test@example.com",
    };

    const createdUser = await createUser(userData);

    expect(createdUser).toBeTruthy();
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser).toHaveProperty("createdAt");

    const userInDb = await User.findOne({ name: "Emir" });
    expect(userInDb).not.toBeNull();
    expect(userInDb!.email).toBe(userData.email);
    expect(userInDb!.verificationToken).not.toBeNull();
    expect(userInDb!.emailConfirmed).toBe(false);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
            to: userData.email,
            subject: "Bestätige deine E-Mail-Adresse",
        })
    );

    const verificationToken = userInDb!.verificationToken!;
    const isVerified = await verifyEmail(verificationToken);

    expect(isVerified).toBe(true);

    const verifiedUserInDb = await User.findOne({ name: "Emir" });
    expect(verifiedUserInDb!.emailConfirmed).toBe(true);
});

test("Falscher verification Token", async () => {
    const invalidToken = "invalidToken123";

    await expect(verifyEmail(invalidToken)).rejects.toThrow("Ungültiger Verifizierungstoken.");
});

test("Abgelaufener Token", async () => {
    const user = await User.create({
        name: "emir",
        password: "password123",
        email: "test@test.com",
        verificationToken: "expiredToken123",
        verificationTokenExpiration: new Date(Date.now() - 3600 * 1000), // Token abgelaufen
        emailConfirmed: false,
    });

    await expect(verifyEmail("expiredToken123")).rejects.toThrow("Verifizierungstoken ist abgelaufen.");
});

test("verifiziert eine email erfolgreich", async () => {
    const user = await User.create({
        name: "emir",
        password: "password123",
        email: "test@test.com",
        verificationToken: "validToken123",
        verificationTokenExpiration: new Date(Date.now() + 3600 * 1000), 
        emailConfirmed: false,
    });

    const result = await verifyEmail("validToken123");

    expect(result).toBe(true);

    const verifiedUser = await User.findOne({ name: "emir" });
    expect(verifiedUser).not.toBeNull();
    expect(verifiedUser!.emailConfirmed).toBe(true);
    expect(verifiedUser!.verificationToken).toBeNull(); 
});

test("Create User - Benutzername existiert bereits", async () => {
    await User.create({
        name: "Emir",
        password: "password123",
        createdAt: new Date(),
        email: "test@test.de",
    });

    const userData: UserResource = {
        name: "Emir",
        password: "password123",
        createdAt: new Date(),
        email: "test@test.de",
    };

    await expect(createUser(userData)).rejects.toThrow("Benutzername existiert bereits.");
});

test("Get User by Name - Benutzer gefunden", async () => {
    const user = await User.create({
        name: "Emir",
        password: "securepassword",
        createdAt: new Date(),
        email: "test@test.de",
    });

    const foundUser = await getUserByName(user.name);
    expect(foundUser).toBeTruthy();
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.password).toBe(user.password);
    expect(foundUser.createdAt).toStrictEqual(user.createdAt);
});

test("Get User by Name - Benutzer nicht gefunden", async () => {
    await expect(getUserByName("Unbekannt")).rejects.toThrow("Fehler beim Abrufen des Benutzers");
});



test("Get User by ID - Fehler beim Abrufen des Benutzers", async () => {
    const invalidUserId = "ungültigeID"; 

    await expect(getUserById(invalidUserId)).rejects.toThrow("Fehler beim Abrufen des Benutzers");
});
