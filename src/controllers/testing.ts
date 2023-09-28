import express from "express";
import Blog from "../models/blog";
import User from "../models/user";
import { Request } from "../interfaces/expressHelper";
import { Response } from "express";
import "express-async-errors";
const router = express.Router();

router.delete("/reset", async (req: Request, res: Response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

export default router;