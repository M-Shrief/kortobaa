import { Response } from "express";
// Utils
import { AppError } from "./appError";
import { logger } from "../logger";

export const isTrustedError = (error: Error) => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

export const handleTrustedError = (error: AppError, res: Response): void => {
  logger.error({
    errorCode: error.httpCode,
    message: error.message,
    isOperational: true,
    stack: error.stack,
  });
  res
    .status(error.httpCode)
    .json({ status: error.httpCode, message: error.message });
};
