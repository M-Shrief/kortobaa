import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorsCenter/appError";
import {
  handleTrustedError,
  isTrustedError,
} from "../utils/errorsCenter/errorHandlers";

export const errorMiddleware = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isTrustedError(err)) process.exit(1);
  handleTrustedError(err, res);
};
