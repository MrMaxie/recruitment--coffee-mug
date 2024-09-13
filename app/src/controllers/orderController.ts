import type { Handler } from 'express';
import { z } from 'zod';
import { startSession } from 'mongoose';
import { Product, Order } from '~/models';
import { HttpError, logger, zodHelpers } from '~/utils';

const createOrderBodySchema = z.object({
    products: z.array(
        z.object({
            productId: zodHelpers.objectId(),
            quantity: z.number().positive(),
        }),
    ),
});

export const createOrder: Handler = async (req, res, next) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const orderData = createOrderBodySchema.parse(req.body);

        let totalAmount = 0;

        // TODO: depends on the requirements and performance tests, we can pull all products at once here
        for (const item of orderData.products) {
            const product = await Product.findById(item.productId).session(session);

            if (!product) {
                throw new HttpError(400, 'Product not found');
            }

            if (product.stock < item.quantity) {
                throw new HttpError(400, 'Insufficient stock');
            }

            product.stock -= item.quantity;
            totalAmount += product.price * item.quantity;
            await product.save();
        }

        const order = new Order({
            // TODO: we can get this from the request, if we have a user authentication
            customerId: 'fake-customer-id',
            totalAmount,
            ...orderData,
        });
        await order.save();

        res.status(201).json({
            id: order.id,
            ...order.toObject()
        });

        await session.commitTransaction();
    } catch (error) {
        logger.error('Error creating order', error);
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const revertOrder: Handler = async (req, res, next) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).session(session);

        if (!order) {
            throw new HttpError(404, 'Order not found');
        }

        for (const item of order.products) {
            const product = await Product.findById(item.productId).session(session);

            // if product is not found, we can ignore it, as it might be deleted

            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.isDeleted = true;
        await order.save();

        res.status(204).end();

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};
