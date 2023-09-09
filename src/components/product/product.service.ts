import {AppDataSource} from '../../db';
// Entities
import { Product } from './product.entity';
// Schemas
import { createSchema } from './product.schema';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    public async getOne(id: string): Promise<Product | false> {

        const existingProduct = await this.productRepository.findOne({
            where: { id },
            select: {
                id: true,
                title: true,
                price: true,
                user: {
                    id: true,
                    name: true
                }
            },
            relations: ['user'],
            cache: 1000 * 5,
          });
        if(!existingProduct) return false;
        return existingProduct;
    } 

    public async post(productData: Product): Promise<Product | false> {
        const isValid = await createSchema.isValid(productData);
        if (!isValid) return false;

        const newProduct = await this.productRepository.save(productData);
        if(!newProduct) return false;
        return newProduct;
    } 
}