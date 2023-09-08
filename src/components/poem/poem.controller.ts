import { NextFunction, Request, Response } from "express";
// Services
import { PoemService } from "./poem.service";
// Types
import { ERROR_MSG } from "./poem.entity";
// Utils
import { AppError } from "../../utils/errorsCenter/appError";
import HttpStatusCode from "../../utils/httpStatusCode";

export class PoemController {
  private poemService = new PoemService();

  public indexWithPoetName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const poems = await this.poemService.getAllWithPoetName();
      if (!poems)
        throw new AppError(
          HttpStatusCode.NOT_FOUND,
          ERROR_MSG.NOT_AVAILABLE,
          true,
        );
      res.status(HttpStatusCode.OK).send(poems);
    } catch (error) {
      next(error);
    }
  };

  public indexIntrosWithPoetName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const poems = await this.poemService.getAllIntrosWithPoetName();
      if (!poems)
        throw new AppError(
          HttpStatusCode.NOT_FOUND,
          ERROR_MSG.NOT_AVAILABLE,
          true,
        );
      res.status(HttpStatusCode.OK).send(poems);
    } catch (error) {
      next(error);
    }
  };

  public indexOneWithPoet = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const poem = await this.poemService.getOneWithPoet(req.params.id);
      if (!poem)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      res.status(HttpStatusCode.OK).send(poem);
    } catch (error) {
      next(error);
    }
  };

  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poem = await this.poemService.post(req.body);
      if (!poem)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      res.status(HttpStatusCode.CREATED).send(poem);
    } catch (error) {
      next(error);
    }
  };

  public postMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poems = await this.poemService.postMany(req.body);
      if (!poems)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      res.status(HttpStatusCode.CREATED).send(poems);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poem = await this.poemService.update(req.params.id, req.body);
      if (!poem)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      // Bug: It gives error when using status()
      res.sendStatus(HttpStatusCode.ACCEPTED).send(poem);
    } catch (error) {
      next(error);
    }
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const poem = await this.poemService.remove(req.params.id);
      if (!poem)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      // Bug: It gives error when using status()
      res.sendStatus(HttpStatusCode.ACCEPTED).send(poem);
    } catch (error) {
      next(error);
    }
  };
}
