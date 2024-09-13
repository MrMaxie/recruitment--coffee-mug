import { type Document, Schema, model } from 'mongoose';

export interface Order extends Document {
    customerId: string;
    products: Array<{
        productId: string;
        quantity: number;
    }>;
    totalAmount: number;
    isDeleted: boolean;
    createdAt: Date;
}

const schema = new Schema<Order>({
    customerId: { type: String, required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Order = model<Order>('Order', schema);
