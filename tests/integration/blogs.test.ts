import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Blog from '../../src/models/blog';
import helper from '../test_helper';

const api = supertest(app);

describe('Testing blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test('/api/blogs must run correctly and return blogs as a json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch("application/json");
  })

  test('/api/blogs should return the correct quantity of blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogToCheck = response.body[0];
  
    expect(blogToCheck.id).toBeDefined();
  });

  test('a new blog post can be created', async () => {
    const newBlog = {
      title: "New blog post for testing",
      author: "Test author",
      url: "https://www.test.com/blog",
      likes: 100,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  
    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).toContain('New blog post for testing');
  });
  
  test('if likes property is missing from the request, it will default to 0', async () => {
    const newBlog = {
      title: "Testing likes property",
      author: "Test author",
      url: "https://www.test.com/likes",
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toBe(0);
  });
  
  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: "Test author",
      likes: 100,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  
    const blogsAtEnd = await helper.blogsInDb();
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('GET /api/blogs/:id returns correct blog with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api.get(`/api/blogs/${blogToView["id"]}`).expect(200);
    expect(resultBlog.body).toEqual(blogToView);
  });

  test('GET /api/blogs/:id returns 404 with non-existent id', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('GET /api/blogs/:id returns 400 with malformed id', async () => {
    const malformedId = '123';
    await api.get(`/api/blogs/${malformedId}`).expect(400);
  });

  test('PUT /api/blogs/:id updates blog correctly with valid id and valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = 200;
    await api.put(`/api/blogs/${blogToUpdate["id"]}`).send(blogToUpdate).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.filter(blog => blog["id"] === blogToUpdate["id"])[0];
    expect(updatedBlog.likes).toEqual(200);
  });

  test('PUT /api/blogs/:id returns 404 with non-existent id', async () => {
    const validNonexistingId = await helper.nonExistingId();
    const blogsAtStart = await helper.blogsInDb();
    await api.put(`/api/blogs/${validNonexistingId}`).send(blogsAtStart[0]).expect(404);
  });

  test('PUT /api/blogs/:id returns 400 with malformed id', async () => {
    const malformedId = '123';
    const blogsAtStart = await helper.blogsInDb();
    await api.put(`/api/blogs/${malformedId}`).send(blogsAtStart[0]).expect(400);
  });

  test('DELETE /api/blogs/:id deletes blog correctly with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete["id"]}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });

  test('DELETE /api/blogs/:id returns 404 with non-existent id', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.delete(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('DELETE /api/blogs/:id returns 400 with malformed id', async () => {
    const malformedId = '123';
    await api.delete(`/api/blogs/${malformedId}`).expect(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
