import { Express } from 'express';
import * as Controller from './controllers';

export const setupRoutes = (app: Express) => {
    app.get('/products', Controller.Product.getAllProducts);
    app.post('/products', Controller.Product.createProduct);

    app.post('/products/:productId/restock', Controller.Product.modifyProductQuantity(1));
    app.post('/products/:productId/sell', Controller.Product.modifyProductQuantity(-1));

    app.post('/orders', Controller.Order.createOrder);
};
