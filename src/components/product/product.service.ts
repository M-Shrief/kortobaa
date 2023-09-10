import {AppDataSource} from '../../db';
// Entities
import { Product } from './product.entity';
// Schemas
import { createSchema, updateSchema } from './product.schema';
// Utils
import { filterAsync } from '../../utils/asyncFilterAndMap';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    public async getOne(id: string, userId: string): Promise<Product | false> {

        const existingProduct = await this.productRepository.findOne({
            where: { id, user: {id: userId} },
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

    public async postMany(
        ProductsData: Product[],
    ): Promise<{newProducts: Product[], nonValidProducts: Product[]} | false> {

        let isValid = async (ProductData: Product) => await createSchema.isValid(ProductData)
        let isNotValid = async (ProductData: Product) => await createSchema.isValid(ProductData) === false

        const validProducts: Product[]  =  await filterAsync(ProductsData, isValid)
        const nonValidProducts: Product[] =  await filterAsync(ProductsData, isNotValid)

        const newProducts = await this.productRepository.save(
        validProducts
        );
        if (!newProducts) return false;

        const result = {newProducts, nonValidProducts}
        return result;
    }

    public async update(id: string, userId: string, productData: Product): Promise<number | false> {
        const isValid = await updateSchema.isValid(productData);
        if (!isValid) return false;

        const newProduct = await this.productRepository.update({id, user: {id: userId}},productData);
        if (!newProduct.affected) return false;
        return newProduct.affected;
    } 

    public async remove(id: string, userId: string): Promise<number | false> {
        const product = await this.productRepository.delete({id, user: {id: userId}});
        if (!product.affected) return false;
        return product.affected;
    }
}