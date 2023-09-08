import { Router } from "express";
import { body, param } from "express-validator";
// Controller
import { PartnerController } from "./partner.controller";
// Types
import { IRoute } from "../../interfaces/route.interface";
import { ERROR_MSG } from "./partner.entity";
// middlewares
import { validate } from "../../middlewares/validate.middleware";
import {
  guard,
  jwtToken,
  authErrorHandler,
} from "../../middlewares/auth.middleware";
import { setCache } from "../../middlewares/cache.middleware";
export class PartnerRoute implements IRoute {
  public router: Router = Router();
  private controller: PartnerController = new PartnerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/partner/:id",
      [
        jwtToken(true),
        guard.check(["partner:read", "partner:write"]),
        authErrorHandler,
        validate([param("id").isUUID().withMessage(ERROR_MSG.NOT_FOUND)]),
        setCache,
      ],
      this.controller.indexInfo,
    );
    this.router.post(
      "/partner/signup",
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
      "/partner/login",
      validate([
        body("phone").isString().escape().withMessage(ERROR_MSG.PHONE),

        body("password").isString().escape().withMessage(ERROR_MSG.PASSWORD),
      ]),
      this.controller.login,
    );
    this.router.post("/partner/logout", this.controller.logout);
    this.router.put(
      "/partner/:id",
      [
        jwtToken(true),
        guard.check(["partner:read", "partner:write"]),
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
      "/partner/:id",
      [
        jwtToken(true),
        guard.check(["partner:read", "partner:write"]),
        authErrorHandler,
        validate([param("id").isUUID().withMessage(ERROR_MSG.NOT_FOUND)]),
      ],
      this.controller.remove,
    );
  }
}
