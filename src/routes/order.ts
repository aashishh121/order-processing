import express from "express";
import orderController from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/orders", orderController.createOrder);
orderRouter.get("/orders/:id", orderController.getOrder);

export default orderRouter;
