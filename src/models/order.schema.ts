import mongoose from "mongoose";
import { validate } from "uuid";

const { Schema } = mongoose;

interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  status: "Pending" | "Processed" | "Failed";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    items: {
      type: [
        {
          productId: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: false, default: "Pending" },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("orders", orderSchema);
