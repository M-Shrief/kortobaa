import { NextFunction, Request, Response } from "express";
// Services
import { ProductService } from "./product.service";
// Types
import { ERROR_MSG } from "./product.entity";
// Utils
import { AppError } from "../../utils/errorsCenter/appError";
import HttpStatusCode from "../../utils/httpStatusCode";

export class ProductController {
    private productService = new ProductService();


    public post = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.post(req.body);
            if(!product)
                throw new AppError(
                    HttpStatusCode.NOT_ACCEPTABLE,
                    ERROR_MSG.NOT_VALID,
                    true
                )
            res.status(HttpStatusCode.CREATED).send(product);
        } catch (error) {
            next(error)            
        }
    }

    public postMulter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const image = Buffer.from(req.file?.buffer!).toString('base64')
            const product = await this.productService.post({...req.body, image});
            if(!product)
                throw new AppError(
                    HttpStatusCode.NOT_ACCEPTABLE,
                    ERROR_MSG.NOT_VALID,
                    true
                )
            res.status(HttpStatusCode.CREATED).send(product);
        } catch (error) {
            next(error)            
        }
    }
}