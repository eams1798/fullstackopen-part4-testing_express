import logger from "./logger";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { Request, UserDocument } from "../interfaces/expressHelper";
import User from "../models/user";


const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info("Method: ", request.method);
  logger.info("Path: ", request.path);
  logger.info("---");
  next();
};

const tokenExtractor = (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);

    request.token = token;
  } else {
    request.token = "";
  }
  next();
};

const userExtractor = async (request: Request, response: Response, next: NextFunction) => {
  const decodedToken = jwt.verify(request.token || "", process.env.SECRET || "");

  if (!decodedToken || typeof decodedToken === "string") {
    return next();
  }

  const user: UserDocument | null = await User.findById(decodedToken.id);
  if (!user ) {
    return next();
  }

  request.user = user;
  next();
};


const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name ===  "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

export default {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
};