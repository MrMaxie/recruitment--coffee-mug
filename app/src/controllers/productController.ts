import type { Handler } from 'express';
import { z } from 'zod';
import { Product } from '~/models';
import { HttpError, zodHelpers } from '~/utils';

const createProductBodySchema = z.object({
    name: z.string().max(50),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().min(0),
});

export const createProduct: Handler = async (req, res, next) => {
    try {
        const productData = createProductBodySchema.parse(req.body);

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            id: product.id,
            ...product.toObject(),
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProducts: Handler = async (req, res, next) => {
    try {
        const products = await Product.find();

        const result: Array<Record<string, unknown> & { id: string }> = [];

        for (const product of products) {
            result.push({
                id: product.id,
                ...product.toObject(),
            });
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const restockProductParamsSchema = z.object({
    productId: zodHelpers.objectId(),
});

export const modifyProductQuantity =
    (deltaQuantity: number): Handler =>
    async (req, res, next) => {
        try {
            const { productId } = restockProductParamsSchema.parse(req.params);

            const product = await Product.findById(productId);

            if (!product) {
                throw new HttpError(404, 'Product not found');
            }

            const newQuantity = product.stock + deltaQuantity;

            if (newQuantity < 0) {
                throw new HttpError(400, 'Stock cannot be negative');
            }

            product.stock = newQuantity;

            await product.save();

            res.json({
                id: product.id,
                ...product.toObject(),
            });
        } catch (error) {
            next(error);
        }
    };
