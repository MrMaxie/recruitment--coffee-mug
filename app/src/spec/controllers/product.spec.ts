import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '~/main';
import { Product } from '~/models';

describe('Product Controller', () => {
    it('GET /products - should return all products', async () => {
        const productNo1 = new Product({
            name: 'Product No. 1',
            description: 'Product No. 1 description',
            price: 100,
            stock: 10,
        });

        const productNo2 = new Product({
            name: 'Product No. 2',
            description: 'Product No. 2 description',
            price: 200,
            stock: 20,
        });

        await productNo1.save();
        await productNo2.save();

        const response = await request(app).get('/products');

        expect(response.body).toMatchObject([
            {
                id: productNo1.id,
                name: 'Product No. 1',
                description: 'Product No. 1 description',
                price: 100,
                stock: 10,
            },
            {
                id: productNo2.id,
                name: 'Product No. 2',
                description: 'Product No. 2 description',
                price: 200,
                stock: 20,
            },
        ]);
        expect(response.status).toBe(200);
    });

    it('POST /products - should allow create a valid product', async () => {
        const response = await request(app).post('/products').send({
            name: 'Product No. 3',
            description: 'Product No. 3 description',
            price: 300,
            stock: 30,
        });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            id: expect.any(String),
            name: 'Product No. 3',
            description: 'Product No. 3 description',
            price: 300,
            stock: 30,
        });
    });

    it('POST /products - should not allow create a product with invalid data', async () => {
        const response = await request(app).post('/products').send({
            name: 'Product No. 4',
            description: 'Product No. 4 description',
            price: 'invalid-price',
            stock: 40,
        });

        expect(response.status).toBe(400);
    });

    it('POST /products - should not allow create a product with negative stock', async () => {
        const response = await request(app).post('/products').send({
            name: 'Product No. 5',
            description: 'Product No. 5 description',
            price: 500,
            stock: -50,
        });

        expect(response.status).toBe(400);
    });

    it('POST /products - should not allow create a product with negative price', async () => {
        const response = await request(app).post('/products').send({
            name: 'Product No. 3',
            description: 'Product No. 3 description',
            price: -1,
            stock: 30,
        });

        expect(response.status).toBe(400);
    });

    it('POST /products - should not allow create a product with too long name (more than 50 characters)', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                name: 'x'.repeat(51),
                description: 'Product No. 3 description',
                price: 300,
                stock: 30,
            });

        expect(response.status).toBe(400);
    });

    it('POST /products - should not allow create product with zero price', async () => {
        const response = await request(app).post('/products').send({
            name: 'Product No. 3',
            description: 'Product No. 3 description',
            price: 0,
            stock: 30,
        });

        expect(response.status).toBe(400);
    });

    it('POST /products/:id/restock - should allow restock a product', async () => {
        const productNo6 = new Product({
            name: 'Product No. 6',
            description: 'Product No. 6 description',
            price: 600,
            stock: 60,
        });

        await productNo6.save();

        const response = await request(app).post(`/products/${productNo6.id}/restock`);

        expect(response.status).toBe(200);
        expect(response.body.stock).toBe(61);
    });

    it('POST /products/:id/restock - should not allow restock a product with invalid id', async () => {
        const response = await request(app).post(`/products/invalid-id/restock`);

        expect(response.status).toBe(400);
    });

    it('POST /products/:id/restock - should not allow restock a product with unused id', async () => {
        const randomId = '60b9f1b3b3b3b3b3b3b3b3b3';

        const response = await request(app).post(`/products/${randomId}/restock`);

        expect(response.status).toBe(404);
    });

    it('POST /products/:id/sell - should allow sell a product', async () => {
        const productNo7 = new Product({
            name: 'Product No. 7',
            description: 'Product No. 7 description',
            price: 700,
            stock: 70,
        });

        await productNo7.save();

        const response = await request(app).post(`/products/${productNo7.id}/sell`);

        expect(response.status).toBe(200);
        expect(response.body.stock).toBe(69);
    });

    it('POST /products/:id/sell - should not allow sell a product with invalid id', async () => {
        const response = await request(app).post(`/products/invalid-id/sell`);

        expect(response.status).toBe(400);
    });

    it('POST /products/:id/sell - should not allow sell a product with unused id', async () => {
        const randomId = '60b9f1b3b3b3b3b3b3b3b3b3';

        const response = await request(app).post(`/products/${randomId}/sell`);

        expect(response.status).toBe(404);
    });

    it('POST /products/:id/sell - should not allow sell a product with insufficient stock', async () => {
        const productNo8 = new Product({
            name: 'Product No. 8',
            description: 'Product No. 8 description',
            price: 800,
            stock: 0,
        });

        await productNo8.save();

        const response = await request(app).post(`/products/${productNo8.id}/sell`);

        expect(response.status).toBe(400);
    });
});
