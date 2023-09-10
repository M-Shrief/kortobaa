import { NextFunction, Request, Response } from "express";
// Services
import { UserService } from "./user.service";
// Types
import { JwtPayload } from "jsonwebtoken";
import { ERROR_MSG } from "./user.entity";
// Utils
import { signToken,decodeToken } from "../../utils/auth";
import { AppError } from "../../utils/errorsCenter/appError";
import HttpStatusCode from "../../utils/httpStatusCode";

export class UserController {
  private userService = new UserService();

  private signToken = (name: string, id: string) =>
    signToken(
      {
        name,
        id,
        permissions: ["user:read", "user:write"],
      },
      {
        algorithm: "RS256",
        expiresIn: "8h",
      },
    );

  public indexInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // headers.authorization is validated in router, so we're certain it'll exist.
      const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
      const user = await this.userService.getInfo(decoded.id);
      if (!user)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      res.status(HttpStatusCode.OK).send(user);
    } catch (error) {
      next(error);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.signup(req.body);
      if (!user)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      const accessToken = this.signToken(user.name, user.id);
      res.status(HttpStatusCode.CREATED).json({
        Success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.login(
        req.body.phone,
        req.body.password,
      );
      if (!user)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
        const accessToken = this.signToken(user.name, user.id);
        res.status(HttpStatusCode.ACCEPTED).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCode.ACCEPTED).send("logged out");
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
      const user = await this.userService.update(decoded.id, req.body);
      if (!user)
        throw new AppError(
          HttpStatusCode.NOT_ACCEPTABLE,
          ERROR_MSG.NOT_VALID,
          true,
        );
      res.sendStatus(HttpStatusCode.ACCEPTED).send(user);
    } catch (error) {
      next(error);
    }
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
      const user = await this.userService.remove(decoded.id);
      if (!user)
        throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
      res.status(HttpStatusCode.ACCEPTED).send("Deleted Successfully");
    } catch (errors) {
      next(errors);
    }
  };
}
