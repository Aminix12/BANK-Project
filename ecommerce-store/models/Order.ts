import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  total: number;
  customerEmail: string;
  customerName?: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed';
  paymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: '',
  },
});

const OrderSchema: Schema = new Schema(
  {
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
