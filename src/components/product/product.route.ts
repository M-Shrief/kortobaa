import { Router } from "express";
import { body } from "express-validator";
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
        this.router.get('/product/:id', this.controller.getOne)

        this.router.post('/product', this.controller.post)

        // An example using multer to get the data from req.file
        // this.router.post('/product', uploadImages.single('image'), this.controller.postMulter)
    }
}