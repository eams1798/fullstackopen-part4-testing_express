import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import bcrypt from "bcrypt";
import User from "../../src/models/user";
import helper from "../test_helper";

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await helper.setDatabase();

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", name: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    console.log(result.error);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  describe("non-valid user should not be created", () => {
    test("duplicated user", async() => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "root2",
        password: "123secret",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400);

      expect(result.body.error).toContain("`username` to be unique");

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test("username length should not be shorter than 3", async () => {
      const newUser = {
        username: "rt",
        name: "Superuser",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain("is shorter than the minimum allowed length (3)");
    });

    test("password length should not be shorter than 3", async () => {
      const newUser = {
        username: "root",
        name: "Superuser",
        password: "sa",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(result.body.error).toContain("weak password");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});