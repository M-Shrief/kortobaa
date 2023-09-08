import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { AppError } from "../utils/errorsCenter/appError";
import HttpStatusCode from "../utils/httpStatusCode";
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    try {
      errors.array().forEach((err) => {
        throw new AppError(HttpStatusCode.BAD_REQUEST, err.msg, true);
      });
    } catch (errors) {
      next(errors);
    }
  };
};
