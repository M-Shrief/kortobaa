import { Router } from "express";
import { body } from "express-validator";
import {  injectable } from "tsyringe";
// Controller
import { UserController } from "./user.controller";
// Types
import { IRoute } from "../../interfaces/route.interface";
import { ERROR_MSG } from "./user.entity";
// middlewares
import { validate } from "../../middlewares/validate.middleware";
import {
  guard,
  jwtToken,
  authErrorHandler,
} from "../../middlewares/auth.middleware";
import { setCache } from "../../middlewares/cache.middleware";
@injectable()
export class UserRoute implements IRoute {
  public router: Router = Router();

  
  constructor(private controller: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/user/me",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
        setCache,
      ],
      this.controller.indexInfo,
    );
    this.router.post(
      "/user/signup",
      validate([
        body("name").isString().trim().escape().withMessage(ERROR_MSG.NAME),

        body("phone")
          .isString()
          .trim()
          .escape()
          // .isMobilePhone('any')
          .withMessage(ERROR_MSG.PHONE),

        body("password")
          .isString()
          .trim()
          // .isStrongPassword()
          .escape()
          .withMessage(ERROR_MSG.PASSWORD),
      ]),
      this.controller.signup,
    );
    this.router.post(
      "/user/login",
      validate([
        body("phone").isString().trim().escape().withMessage(ERROR_MSG.PHONE),

        body("password").isString().trim().escape().withMessage(ERROR_MSG.PASSWORD),
      ]),
      this.controller.login,
    );
    this.router.post("/user/logout", this.controller.logout);
    this.router.put(
      "/user/me",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
        validate([
          body("name")
            .optional()
            .isString()
            .trim()
            .escape()
            .withMessage(ERROR_MSG.NAME),

          body("phone")
            .optional()
            .isString()
            .escape()
            .trim()
            // .isMobilePhone('any')
            .withMessage(ERROR_MSG.PHONE),

          body("password")
            .optional()
            .isString()
            .trim()
            // .isStrongPassword()
            .escape()
            .withMessage(ERROR_MSG.PASSWORD),
        ]),
      ],
      this.controller.update,
    );
    this.router.delete(
      "/user/me",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
      ],
      this.controller.remove,
    );
  }
}
