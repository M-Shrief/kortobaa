import { Router } from "express";
import { body, param } from "express-validator";
// Controller
import { PoetController } from "./poet.controller";
// Types
import { IRoute } from "../../interfaces/route.interface";
import { ERROR_MSG } from "./poet.entity";
// middlewares
import { validate } from "../../middlewares/validate.middleware";
import { setCache } from "../../middlewares/cache.middleware";

export class PoetRoute implements IRoute {
  public router: Router = Router();
  private controller: PoetController = new PoetController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/poets", setCache, this.controller.index);
    this.router.get(
      "/poet/:id",
      [
        validate([param("id").isUUID(4).withMessage(ERROR_MSG.NOT_FOUND)]),
        setCache,
      ],
      this.controller.indexOneWithLiterature,
    );
    this.router.post(
      "/poet",
      validate([
        body("name").isString().escape().withMessage(ERROR_MSG.NAME),
        body("time_period")
          .isString()
          .escape()
          .withMessage(ERROR_MSG.TIME_PERIOD),
        body("bio").isString().escape().withMessage(ERROR_MSG.BIO),
        body("reviewed").optional().isBoolean().withMessage(ERROR_MSG.REVIEWED),
      ]),
      this.controller.post,
    );

    this.router.post("/poets", this.controller.postMany);

    this.router.put(
      "/poet/:id",
      validate([
        param("id").isUUID(4).withMessage(ERROR_MSG.NOT_FOUND),

        body("name").optional().isString().escape().withMessage(ERROR_MSG.NAME),

        body("time_period")
          .optional()
          .isString()
          .escape()
          .withMessage(ERROR_MSG.TIME_PERIOD),

        body("bio").optional().isString().escape().withMessage(ERROR_MSG.BIO),

        body("reviewed").optional().isBoolean().withMessage(ERROR_MSG.REVIEWED),
      ]),
      this.controller.update,
    );
    this.router.delete(
      "/poet/:id",
      [validate([param("id").isUUID(4).withMessage(ERROR_MSG.NOT_FOUND)])],
      this.controller.remove,
    );
  }
}
