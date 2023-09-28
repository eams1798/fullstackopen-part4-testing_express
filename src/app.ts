import { MONGODB_URI } from "./utils/config";
import express from "express";
import cors from "cors";
import blogsRouter from "./controllers/blogs";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import testingRouter from "./controllers/testing";
import middleware from "./utils/middleware";
import logger from "./utils/logger";
import mongoose from "mongoose";

const app = express();

const startApp = async () => {
  try {
    logger.info("connecting to", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);

    logger.info("connected to MongoDB");

    app.use(cors());
    app.use(express.static("build"));
    app.use(express.json());
    app.use(middleware.requestLogger);
    app.use(middleware.tokenExtractor);
    app.use("/api/login", loginRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/blogs", blogsRouter);
    if (process.env.NODE_ENV === "test") {
      app.use("/api/testing", testingRouter);
    }
    app.use(middleware.unknownEndpoint);
    app.use(middleware.errorHandler);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error connecting to MongoDB:", error);
  }
};

startApp();

export default app;
