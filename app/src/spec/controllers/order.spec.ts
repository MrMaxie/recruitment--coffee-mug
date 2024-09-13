import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '~/main';
import { Product } from '~/models';

describe('Order Controller', () => {
    it('POST /orders - should allow create an valid order', async () => {
        const productNo1 = new Product({
            name: 'Product No. 1',
            description: 'Product No. 1 description',
            price: 100,
            stock: 10,
        });

        await productNo1.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo1.id,
                        quantity: 1,
                    },
                ],
            });

        expect(response.body).toMatchObject({
            id: expect.any(String),
            products: [
                {
                    productId: productNo1.id,
                    quantity: 1,
                },
            ],
            totalAmount: 100,
        });
        expect(response.status).toBe(201);
    });

    it('POST /orders - should not allow create an order with invalid product', async () => {
        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: 'invalid-product-id',
                        quantity: 1,
                    },
                ],
            });

        expect(response.status).toBe(400);
    });

    it('POST /orders - should not allow create an order with insufficient stock', async () => {
        const productNo2 = new Product({
            name: 'Product No. 2',
            description: 'Product No. 2 description',
            price: 100,
            stock: 0,
        });

        await productNo2.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo2.id,
                        quantity: 1,
                    },
                ],
            });

        expect(response.status).toBe(400);
    });

    it('POST /orders - should not allow create an order with invalid quantity', async () => {
        const productNo3 = new Product({
            name: 'Product No. 3',
            description: 'Product No. 3 description',
            price: 100,
            stock: 10,
        });

        await productNo3.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo3.id,
                        quantity: -1,
                    },
                ],
            });

        expect(response.status).toBe(400);
    });

    it('POST /orders - should allow create an order with multiple products', async () => {
        const productNo4 = new Product({
            name: 'Product No. 4',
            description: 'Product No. 4 description',
            price: 100,
            stock: 10,
        });

        const productNo5 = new Product({
            name: 'Product No. 5',
            description: 'Product No. 5 description',
            price: 100,
            stock: 10,
        });

        await productNo4.save();
        await productNo5.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo4.id,
                        quantity: 1,
                    },
                    {
                        productId: productNo5.id,
                        quantity: 1,
                    },
                ],
            });

        expect(response.body).toMatchObject({
            products: [
                {
                    productId: productNo4.id,
                    quantity: 1,
                },
                {
                    productId: productNo5.id,
                    quantity: 1,
                },
            ],
        });
        expect(response.status).toBe(201);
    });

    it('POST /orders - should not allow to create an order with single invalid product in multiple products', async () => {
        const productNo6 = new Product({
            name: 'Product No. 6',
            description: 'Product No. 6 description',
            price: 100,
            stock: 10,
        });

        await productNo6.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo6.id,
                        quantity: 1,
                    },
                    {
                        productId: 'invalid-product-id',
                        quantity: 1,
                    },
                ],
            });

        expect(response.status).toBe(400);

        const productNo6After = await Product.findById(productNo6.id);

        expect(productNo6After?.stock).toBe(10);
    });

    it('POST /orders - should calculate total amount correctly', async () => {
        const productNo7 = new Product({
            name: 'Product No. 7',
            description: 'Product No. 7 description',
            price: 100,
            stock: 10,
        });

        const productNo8 = new Product({
            name: 'Product No. 8',
            description: 'Product No. 8 description',
            price: 200,
            stock: 10,
        });

        await productNo7.save();
        await productNo8.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo7.id,
                        quantity: 1,
                    },
                    {
                        productId: productNo8.id,
                        quantity: 2,
                    },
                ],
            });

        expect(response.body.totalAmount).toBe(500);
        expect(response.status).toBe(201);
    });

    it('POST /orders - should assign a fake customer id', async () => {
        const productNo9 = new Product({
            name: 'Product No. 9',
            description: 'Product No. 9 description',
            price: 100,
            stock: 10,
        });

        await productNo9.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo9.id,
                        quantity: 1,
                    },
                ],
            });

        expect(response.body.customerId).toBe('fake-customer-id');
        expect(response.status).toBe(201);
    });

    it('POST /orders - should store date of creation of the order', async () => {
        const productNo10 = new Product({
            name: 'Product No. 10',
            description: 'Product No. 10 description',
            price: 100,
            stock: 10,
        });

        const timestamp = Date.now();
        await productNo10.save();

        const response = await request(app)
            .post('/orders')
            .send({
                products: [
                    {
                        productId: productNo10.id,
                        quantity: 1,
                    },
                ],
            });

        const createdAtTimestamp = new Date(response.body.createdAt).getTime();

        expect(response.body.createdAt).toBeDefined();
        expect(createdAtTimestamp - timestamp).toBeLessThan(2000);
        expect(response.status).toBe(201);
    });
});
