import express from "express";
import { Request, Response, NextFunction } from "express";
import Blog from "../models/blog";
import "express-async-errors";

const blogRouter = express.Router();

blogRouter.get('/', async (request: Request, response: Response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

blogRouter.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog.toJSON());
  } else {
    next();
  }
});

blogRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ 
      error: 'title or url missing' 
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog.toJSON());
});

blogRouter.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  if (updatedBlog) {
    response.json(updatedBlog.toJSON());
  } else {
    next();
  }
});

blogRouter.delete('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const result = await Blog.findByIdAndRemove(request.params.id);
  if (result) {
    response.status(204).end();
  } else {
    next();
  }
});

export default blogRouter;
