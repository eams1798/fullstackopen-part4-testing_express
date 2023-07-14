import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app";
import User from "../../src//models/user";
import helper from "../test_helper";

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await helper.encryptPasswords("testpassword");
  const user = new User({ username: "testuser", name: "Tester", passwordHash });

  await user.save();
});

describe("tests for login", () => {
  test("login succeeds with correct credentials", async () => {
    const loginInfo = {
      username: "testuser",
      password: "testpassword",
    };

    const result = await api
      .post("/api/login")
      .send(loginInfo)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(result.body.token).toBeDefined();
  });

  test("login fails with incorrect password", async () => {
    const loginInfoWithWrongPassword = {
      username: "testuser",
      password: "wrongpassword",
    };

    const result = await api
      .post("/api/login")
      .send(loginInfoWithWrongPassword)
      .expect(401);

    expect(result.body.error).toContain("invalid username or password");
    expect(result.body.token).not.toBeDefined();
  });

});

afterAll(() => {
  mongoose.connection.close();
});
