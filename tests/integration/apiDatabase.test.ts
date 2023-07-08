import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Blog from '../../src/models/blog';
import helper from '../test_helper';

const api = supertest(app);

describe('Testing the api', () => {
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

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
