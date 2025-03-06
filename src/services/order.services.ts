import { ErrorMsgs, SuccessMsgs } from "../enums/common";
import ApiResponse from "../utils/ApiResponse";
import { Order } from "../models/order.schema";
import { User } from "../models/user.schema";
import { v4 as uuidv4 } from "uuid";
import inventoryServices from "./inventory.services";
import { sendMessage } from "../producer/aws.producer.";
import { redisClient } from "../config/redis.config";
import { InewOrder } from "../types/common.types";

const createOrder = async (body: any, res: any) => {
  try {
    const { userId, items, totalAmount } = body;

    if (items.length == 0) {
      return res.json(
        ApiResponse(false, 200, "Items should not be empty", null)
      );
    }
    const userExist = await User.findOne({ userId }).exec();

    if (!userExist) {
      return res.json(ApiResponse(false, 200, ErrorMsgs.USER_NOTFOUND, null));
    }

    const isAvailable = await inventoryServices.checkStock(items);
    if (!isAvailable) {
      return res.json(
        ApiResponse(false, 200, "Some items are out of stock", null)
      );
    }

    const orderId = uuidv4();
    const newOrder: InewOrder = {
      orderId: orderId,
      userId,
      items,
      totalAmount,
      status: "Pending",
    };
    await redisClient.setEx(`${orderId}`, 600, JSON.stringify(newOrder));
    await inventoryServices.updateStockBulk(items);
    sendMessage(newOrder);
    return res.json(ApiResponse(true, 200, SuccessMsgs.ORDER_CREATED, null));
  } catch (error: any) {
    return res.json(ApiResponse(false, 400, error.message + " error", null));
  }
};

const getOrder = async (id: string, res: any) => {
  try {
    const orderCacheExist = await redisClient.get(id);
    if (orderCacheExist) {
      return res.json(
        ApiResponse(true, 200, "Order found!", JSON.parse(orderCacheExist))
      );
    }
    const orderExist = await Order.findOne({ orderId: id }).exec();

    if (!orderExist) {
      return res.json(ApiResponse(false, 200, "Order not found!", null));
    }

    const respObj = {
      userId: orderExist.userId,
      items: orderExist.items,
      totalAmount: orderExist.totalAmount,
      status: orderExist.status,
      createdAt: orderExist.createdAt,
      updatedAt: orderExist.updatedAt,
    };

    await redisClient.setEx(
      `${orderExist.orderId}`,
      600,
      JSON.stringify(respObj)
    );

    return res.json(ApiResponse(true, 200, "Order found!", respObj));
  } catch (error: any) {
    return res.json(ApiResponse(false, 400, error.message + "error", null));
  }
};

const orderServices = { createOrder, getOrder };
export default orderServices;
