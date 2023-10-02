import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { Request, Response } from "express";
import User from "../models/user";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  if (!(body.username && body.password)) {
    return res.status(400).json({
      error: "Missing username or password"
    });
  }

  const user = await User.findOne({ username: body.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password"
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET || "");

  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default loginRouter;
