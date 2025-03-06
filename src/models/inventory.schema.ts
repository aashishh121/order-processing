import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, required: true },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
