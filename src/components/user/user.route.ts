import { Router } from "express";
import { body, param } from "express-validator";
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
export class UserRoute implements IRoute {
  public router: Router = Router();
  private controller: UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/user/:id",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
        validate([param("id").isUUID().withMessage(ERROR_MSG.NOT_FOUND)]),
        setCache,
      ],
      this.controller.indexInfo,
    );
    this.router.post(
      "/user/signup",
      validate([
        body("name").isString().escape().withMessage(ERROR_MSG.NAME),

        body("phone")
          .isString()
          .escape()
          // .isMobilePhone('any')
          .withMessage(ERROR_MSG.PHONE),

        body("password")
          .isString()
          // .isStrongPassword()
          .escape()
          .withMessage(ERROR_MSG.PASSWORD),
      ]),
      this.controller.signup,
    );
    this.router.post(
      "/user/login",
      validate([
        body("phone").isString().escape().withMessage(ERROR_MSG.PHONE),

        body("password").isString().escape().withMessage(ERROR_MSG.PASSWORD),
      ]),
      this.controller.login,
    );
    this.router.post("/user/logout", this.controller.logout);
    this.router.put(
      "/user/:id",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
        validate([
          param("id").isUUID().withMessage(ERROR_MSG.NOT_FOUND),

          body("name")
            .optional()
            .isString()
            .escape()
            .withMessage(ERROR_MSG.NAME),

          body("phone")
            .optional()
            .escape()
            .isString()
            // .isMobilePhone('any')
            .withMessage(ERROR_MSG.PHONE),

          body("password")
            .optional()
            .isString()
            // .isStrongPassword()
            .escape()
            .withMessage(ERROR_MSG.PASSWORD),
        ]),
      ],
      this.controller.update,
    );
    this.router.delete(
      "/user/:id",
      [
        jwtToken(true),
        guard.check(["user:read", "user:write"]),
        authErrorHandler,
        validate([param("id").isUUID().withMessage(ERROR_MSG.NOT_FOUND)]),
      ],
      this.controller.remove,
    );
  }
}
