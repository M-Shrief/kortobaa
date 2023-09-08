import { NextFunction, Request, Response } from "express";
// Services
import { PoetService } from "./poet.service";
// Types
import { ERROR_MSG } from "./poet.entity";
// Utils
import { AppError } from "../../utils/errorsCenter/appError";
import HttpStatusCode from "../../utils/httpStatusCode";

export class PoetController {
  private poetService = new PoetService();

  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poets = await this.poetService.getAll();
      if (!poets) {
        throw new AppError(
          HttpStatusCode.NOT_FOUND,
          ERROR_MSG.NOT_AVAILABLE,
          true,
        );
      }
      res.status(HttpStatusCode.OK).send(poets);
    } catch (errors) {
      next(errors);
    }
  };

  public indexOneWithLiterature = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const poet = await this.poetService.getOneWithLiterature(req.params.id);
      if (!poet)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      return res.status(HttpStatusCode.OK).send(poet);
    } catch (err) {
      next(err);
    }
  };

  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poet = await this.poetService.post(req.body);
      if (!poet)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      res.status(HttpStatusCode.CREATED).send(poet);
    } catch (errors) {
      next(errors);
    }
  };

  public postMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poets = await this.poetService.postMany(req.body);
      if (!poets)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      res.status(HttpStatusCode.CREATED).send(poets);
    } catch (errors) {
      next(errors);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poet = await this.poetService.update(req.params.id, req.body);
      if (!poet)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      // Bug: it gives error with res.status but works with res.sendStatus
      res.sendStatus(HttpStatusCode.ACCEPTED).send(poet);
    } catch (errors) {
      next(errors);
    }
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poet = await this.poetService.remove(req.params.id);
      if (!poet)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      res.status(HttpStatusCode.ACCEPTED).send("Deleted Successfully");
    } catch (errors) {
      next(errors);
    }
  };
}
