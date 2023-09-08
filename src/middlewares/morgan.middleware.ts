import morgan, { StreamOptions } from "morgan";
import { NODE_ENV } from "../config";
// Utils
import { logger } from "../utils/logger";

const stream: StreamOptions = {
  write: (message: string) =>
    logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

const skip = () => {
  const env = NODE_ENV || "development";
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);
