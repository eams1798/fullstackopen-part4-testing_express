import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import helper from "../test_helper";

const api = supertest(app);

describe("Testing blogs", () => {
  beforeEach(async () => {
    await helper.setDatabase();
  });

  test("GET /api/blogs must run correctly and return blogs as a json", async () => {
    const response = await api.get("/api/blogs");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch("application/json");
  });

  test("GET /api/blogs should return the correct quantity of blogs", async () => {
    const initialBlogs = await helper.blogsInDb();
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blogToCheck = response.body[0];

    expect(blogToCheck.id).toBeDefined();
  });

  test("GET /api/blogs/:id returns correct blog with valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api.get(`/api/blogs/${blogToView["id"]}`).expect(200);
    blogToView.user = blogToView.user.toString();
    expect(resultBlog.body).toEqual(blogToView);
  });

  test("GET /api/blogs/:id returns 404 with non-existent id", async () => {
    const validNonexistingId = await helper.nonExistingBlogId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("GET /api/blogs/:id returns 400 with malformed id", async () => {
    const malformedId = "123";
    await api.get(`/api/blogs/${malformedId}`).expect(400);
  });

  test("POST /api/blogs fails with status code 401 if no token is provided", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Test author",
      url: "https://www.test.com/blog",
      likes: 100,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);
  });

  test("POST /api/blogs fails with status code 401 if an invalid token is provided", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Test author",
      url: "https://www.test.com/blog",
      likes: 100,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer invalidtoken")
      .send(newBlog)
      .expect(400);
  });

  test("a new blog post can be created if a valid token is provided", async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Test author",
      url: "https://www.test.com/blog",
      likes: 100,
    };

    const initialBlogs = await helper.blogsInDb();
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).toContain("New blog post for testing");
  });

  test("if likes property is missing from the request, it will default to 0", async () => {
    const newBlog = {
      title: "Testing likes property",
      author: "Test author",
      url: "https://www.test.com/likes",
    };

    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("blog without title and url is not added", async () => {
    const newBlog = {
      author: "Test author",
      likes: 100,
    };

    const initialBlogs = await helper.blogsInDb();
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });


  test("PUT /api/blogs/:id updates blog correctly with valid id and valid data", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const initialUsers = await helper.usersInDb();

    const blogToUpdate = blogsAtStart.filter(blog => initialUsers[0].id === blog.user.toString())[0];
    const propertiesToUpdate = { likes: 200 };

    await api
      .put(`/api/blogs/${blogToUpdate["id"]}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(propertiesToUpdate).expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.filter(blog => blog["id"] === blogToUpdate["id"])[0];
    expect(updatedBlog.likes).toEqual(200);
  });

  test("PUT /api/blogs/:id returns 404 with non-existent id", async () => {
    const validNonexistingId = await helper.nonExistingBlogId();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const propertiesToUpdate = { likes: 200 };
    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(propertiesToUpdate)
      .expect(404);
  });

  test("PUT /api/blogs/:id returns 400 with malformed id", async () => {
    const malformedId = "123";
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const propertiesToUpdate = { likes: 200 };
    await api
      .put(`/api/blogs/${malformedId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(propertiesToUpdate)
      .expect(400);
  });

  test("DELETE /api/blogs/:id deletes blog correctly with valid id", async () => {
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete["id"]}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });

  test("DELETE /api/blogs/:id returns 404 with non-existent id", async () => {
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const validNonexistingId = await helper.nonExistingBlogId();
    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(404);
  });

  test("DELETE /api/blogs/:id returns 400 with malformed id", async () => {
    const loginResponse = await api
      .post("/api/login")
      .send({ username: helper.initialUsers[0].username, password: helper.password1 });

    const userToken = loginResponse.body.token;

    const malformedId = "123";
    await api.delete(`/api/blogs/${malformedId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
