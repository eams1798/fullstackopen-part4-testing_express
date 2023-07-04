import express from "express";
import Blog from "../models/blog";
import { Request, Response } from "express";

const blogRouter = express.Router();

blogRouter.get('/', (request: Request, response: Response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogRouter.post('/', (request: Request, response: Response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

export default blogRouter;