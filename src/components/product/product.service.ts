import {AppDataSource} from '../../db';
// Entities
import { Product } from './product.entity';
// Schemas
import { createSchema, updateSchema } from './product.schema';
// Utils
import { filterAsync } from '../../utils/asyncFilterAndMap';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);


    public async getAll(): Promise<Product[] | false> {
        const products = await this.productRepository.find({
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
            user: {
                id: true,
                name: true,
            }
          },
          relations:  ['user'],
          cache: true,
        });
        if (products.length === 0) return false;
        return products;
    }

    public async getOne(id: string): Promise<Product | false> {

        const existingProduct = await this.productRepository.findOne({
            where: { id },
            select: {
                id: true,
                title: true,
                price: true,
                image: true,
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
        productsData: Product[],
    ): Promise<{newProducts: Product[], nonValidProducts: Product[]} | false> {

        let isValid = async (productData: Product) => await createSchema.isValid(productData)
        let isNotValid = async (productData: Product) => await createSchema.isValid(productData) === false

        const validProducts: Product[]  =  await filterAsync(productsData, isValid)
        const nonValidProducts: Product[] =  await filterAsync(productsData, isNotValid)

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