import { MONGODB_URI } from "./utils/config";
import express from "express";
import cors from "cors";
import blogsRouter from "./controllers/blogs";
import usersRouter from "./controllers/users";
import middleware from "./utils/middleware";
import logger from "./utils/logger";
import mongoose from "mongoose";

const app = express();

logger.info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then (() => {
    logger.info('connected to MongoDB');

    app.use(cors());
    app.use(express.static('build'));
    app.use(express.json());
    app.use(middleware.requestLogger);
    app.use('/api/blogs', blogsRouter);
    app.use('/api/users', usersRouter);
    app.use(middleware.unknownEndpoint);
    app.use(middleware.errorHandler);
  }).catch ((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

export default app;