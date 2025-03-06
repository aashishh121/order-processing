import orderServices from "../services/order.services";

const createOrder = (req: any, res: any) => {
  orderServices.createOrder(req.body, res);
};
const getOrder = (req: any, res: any) => {
  orderServices.getOrder(req.params.id, res);
};

const orderController = { createOrder, getOrder };
export default orderController;
