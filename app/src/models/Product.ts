import { type Document, Schema, model } from 'mongoose';

export interface Product extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
}

const schema = new Schema<Product>({
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
});

export const Product = model<Product>('Product', schema);
