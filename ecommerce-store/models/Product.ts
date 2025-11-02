import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ salesCount: -1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
