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
  } catch (err) {
    next(err);
  }
};

// import { NextFunction, Request, Response } from 'express';
// import jwt, { Secret } from 'jsonwebtoken';

// export const authorizeJWT = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.header('Authorization');

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     if (token == undefined) return res.status(401).send('Unauthorized Request');

//     jwt.verify(
//       token,
//       process.env.JWT_PRIVATE as Secret,
//       (err: any, user: any) => {
//         if (err) {
//           return res.status(403).send('Unauthorized Request');
//         }
//         // TODO: Figure types
//         req.user = user;
//         next();
//       }
//     );
//   }
// };
