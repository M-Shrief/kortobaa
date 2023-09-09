import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import guardFactory from "express-jwt-permissions";
import HttpStatusCode from "../utils/httpStatusCode";
import { AppError } from "../utils/errorsCenter/appError";

export const jwtToken = (bln?: boolean) =>
  expressjwt({
    secret: process.env.JWT_PRIVATE as string,
    algorithms: ["RS256"],
    credentialsRequired: bln ?? false, // set:false to identify registered users while still providing access to unregistered users.
    requestProperty: "user", // req.auth by default
  });

export const guard = guardFactory();

export const authErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (error.name == "UnauthorizedError")
      throw new AppError(
        HttpStatusCode.UNAUTHORIZED,
        "Unautorized for this request",
        true,
      );
    if (error.name === 'permission_denied') 
      throw new AppError(
        HttpStatusCode.FORBIDDEN,
        'Forbidden request',
        true,
      );
  } catch (err) {
    next(err);
  }
};