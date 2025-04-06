import { User } from '../../src/model/UserModel';


test("Create User", async () => {
    const user = await User.create({ name: "John Doe", password: "securepassword", email: "john@test.de" });

    expect(user).toBeTruthy();
    expect(user._id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.password).not.toBe("securepassword");
    expect(user.createdAt).toBeDefined();

    const isMatch = await user.isCorrectPassword("securepassword");
    expect(isMatch).toBe(true);
});


test("Delete User", async () => {
    const user = await User.create({ name: "John Doe", password: "securepassword", email: "john@test.de" });
    await User.findByIdAndDelete(user._id);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
});

