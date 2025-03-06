import { Inventory } from "../models/inventory.schema";

async function checkStock(items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    const product = await Inventory.findOne({ productId: item.productId });
    if (!product || product.stock < item.quantity) return false;
  }
  return true;
}

export const updateStockBulk = async (items: []) => {
  try {
    const bulkOperations = items.map(
      (item: { productId: string; quantity: Number }) => ({
        updateOne: {
          filter: { productId: item?.productId },
          update: { $inc: { stock: -item?.quantity } },
        },
      })
    );

    await Inventory.bulkWrite(bulkOperations);
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

const inventoryServices = { checkStock, updateStockBulk };
export default inventoryServices;
