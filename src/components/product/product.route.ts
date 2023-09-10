import { Router } from "express";
import { body, param } from "express-validator";
// Controller
import { ProductController } from "./product.controller";
// Types
import { IRoute } from "../../interfaces/route.interface";
import { ERROR_MSG } from "./product.entity";
// middlewares
import { validate } from "../../middlewares/validate.middleware";
import {
  guard,
  jwtToken,
  authErrorHandler,
} from "../../middlewares/auth.middleware";
import { setCache } from "../../middlewares/cache.middleware";

import multer from "multer";
const uploadImages = multer({ limits: {fileSize: 4 * 1024 * 1024,}});

export class ProductRoute implements IRoute {
    public router: Router = Router();
    private controller = new ProductController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get('/products',this.controller.getAll)

        this.router.get(
            '/product/:id',
            [validate([param('id').isUUID(4).withMessage(ERROR_MSG.NOT_FOUND)])],
            this.controller.getOne
        )

        this.router.post(
            '/product',
            [
                jwtToken(true),
                guard.check(["user:read", "user:write"]),
                authErrorHandler,
                validate([
                    body('title')
                        .isString()
                        .trim()
                        .escape()
                        .withMessage(ERROR_MSG.TITLE),

                    body('price')
                        .isInt({min: 0}).withMessage(ERROR_MSG.PRICE),

                    body('image')
                        .isString()
                        .isBase64()
                        .withMessage(ERROR_MSG.IMAGE)
                ]),
            ],
            this.controller.post
        )

        // An example using multer to get the data from req.file
        // this.router.post(
        //     '/product',
        //     [
        //         uploadImages.single('image'),
        //         jwtToken(true),
        //         guard.check(["user:read", "user:write"]),
        //         authErrorHandler,
        //     ],
        //     this.controller.postMulter
        // )


        this.router.post(
            '/products',
            [
                jwtToken(true),
                guard.check(["user:read", "user:write"]),
                authErrorHandler,
            ],
            this.controller.postMany
        )

        this.router.put(
            '/product/:id', 
            [
                jwtToken(true),
                guard.check(["user:read", "user:write"]),
                authErrorHandler,
                validate([
                    param('id').isUUID(4).withMessage(ERROR_MSG.NOT_FOUND),

                    body('title')
                        .optional()
                        .isString()
                        .trim()
                        .escape()
                        .withMessage(ERROR_MSG.TITLE),

                    body('price')
                        .optional()
                        .isInt({min: 0})
                        .withMessage(ERROR_MSG.PRICE),

                    body('image')
                        .optional()
                        .isString()
                        .isBase64()
                        .withMessage(ERROR_MSG.IMAGE)
                ]),
            ],
            this.controller.update
        )
        
        this.router.delete(
            '/product/:id',
            [
                jwtToken(true),
                guard.check(["user:read", "user:write"]),
                authErrorHandler,
                validate([param('id').isUUID(4).withMessage(ERROR_MSG.NOT_FOUND)]),
            ],
            this.controller.remove
        )
    }
}