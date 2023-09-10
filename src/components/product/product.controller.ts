import { NextFunction, Request, Response } from "express";
// Services
import { ProductService } from "./product.service";
// Types
import { ERROR_MSG, Product } from "./product.entity";
import { JwtPayload } from "jsonwebtoken";
// Utils
import { AppError } from "../../utils/errorsCenter/appError";
import HttpStatusCode from "../../utils/httpStatusCode";
import { decodeToken } from "../../utils/auth";

export class ProductController {
    private productService = new ProductService();

    public getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {  
            const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
            const product = await this.productService.getOne(req.params.id, decoded.id);
            if(!product)
                throw new AppError(
                    HttpStatusCode.NOT_FOUND,
                    ERROR_MSG.NOT_FOUND,
                    true
                )
            res.status(HttpStatusCode.CREATED).send(product);
        } catch (error) {
            next(error)
        }
    }

    public post = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
            const product = await this.productService.post({...req.body, user: decoded.id});
            if(!product)
                throw new AppError(
                    HttpStatusCode.NOT_ACCEPTABLE,
                    ERROR_MSG.NOT_VALID,
                    true
                )
            res.status(HttpStatusCode.OK).send(product);
        } catch (error) {
            next(error)            
        }
    }

    public postMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
          const productsData = req.body.map((productData: Product) => {return {...productData, user: decoded.id}})
          const products = await this.productService.postMany(productsData);
          if (!products)
            throw new AppError(
              HttpStatusCode.NOT_ACCEPTABLE,
              ERROR_MSG.NOT_VALID,
              true,
            );
          res.status(HttpStatusCode.CREATED).send(products);
        } catch (errors) {
          next(errors);
        }
    };

    public postMulter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
            const image = Buffer.from(req.file?.buffer!).toString('base64')
            const product = await this.productService.post({...req.body, image, user: decoded.id});
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

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {  
            const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
            const product = await this.productService.update(req.params.id, decoded.id, req.body);
            if(!product)
                throw new AppError(
                    HttpStatusCode.NOT_ACCEPTABLE,
                    ERROR_MSG.NOT_VALID,
                    true
                )
            res.sendStatus(HttpStatusCode.ACCEPTED).send(product);
        } catch (error) {
            next(error)
        }
    }

    public remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decoded = decodeToken(req.headers.authorization!.slice(7)) as JwtPayload;
            const product = await this.productService.remove(req.params.id, decoded.id);
            if (!product)
                throw new AppError(HttpStatusCode.NOT_FOUND, ERROR_MSG.NOT_FOUND, true);
          res.status(HttpStatusCode.ACCEPTED).send("Deleted Successfully");
        } catch (errors) {
          next(errors);
        }
      };
}