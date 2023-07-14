import app from "./app";
import { createServer } from "http";
import { PORT } from "./utils/config";
import logger from "./utils/logger";

const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});