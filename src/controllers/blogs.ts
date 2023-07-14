import express from "express";
import { Response, NextFunction } from "express";
import middleware from "../utils/middleware";
import { Request } from "../interfaces/expressHelper";
import Blog from "../models/blog";
import "express-async-errors";


const blogRouter = express.Router();

blogRouter.get("/", async (request: Request, response: Response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogRouter.get("/:id", async (request: Request, response: Response, next: NextFunction) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog.toJSON());
  } else {
    next();
  }
});

blogRouter.post("/", middleware.userExtractor, async (request: Request, response: Response) => {
  const body = request.body;
  const user = request.user;

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: "title or url missing"
    });
  }

  if (!user) {
    return response.status(404).json({
      error: "user not found"
    });
  }

  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog.toJSON());
});

blogRouter.put("/:id", middleware.userExtractor, async (request: Request, response: Response, next: NextFunction) => {
  const body = request.body;
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }
  if (!user) {
    return response.status(404).json({
      error: "user not found"
    });
  }
  if (blog.user.toString() !== user.id?.toString()) {
    return response.status(403).json({ error: "only the creator can edit the blog" });
  }

  const updatedFields = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, { new: true });
  if (updatedBlog) {
    response.json(updatedBlog.toJSON());
  } else {
    next();
  }
});

blogRouter.delete("/:id", middleware.userExtractor, async (request: Request, response: Response, next: NextFunction) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }
  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  if (blog.user.toString() !== user.id?.toString()) {
    return response.status(403).json({ error: "only the creator can delete the blog" });
  }

  const result = await blog.deleteOne();
  if (result) {
    response.status(204).end();
  } else {
    next();
  }
});

export default blogRouter;
