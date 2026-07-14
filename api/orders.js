import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import { createOrder, getAllOrders, getOrderById } from "#db/queries/orders";
import {
  createOrderProductRow,
  getProductsInOrder,
} from "#db/queries/orders_products";
import { getProductById } from "#db/queries/products";
const router = express.Router();
export default router;

router.use(requireUser);

router.post("/", requireBody(["date"]), async (req, res) => {
  const { date, note } = req.body;
  const order = await createOrder(date, note, req.user.id);
  res.status(201).send(order);
});

router.get("/", async (req, res) => {
  const orders = await getAllOrders(req.user.id);
  res.send(orders);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await getOrderById(id, req.user.id);
  if (!order) return res.status(404).send();
  if (order.user_id !== req.user.id) return res.status(403).send();
  res.send(order);
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const { id } = req.params;
    const order = await getOrderById(id, req.user.id);

    if (!order) return res.status(404).send();

    if (order.user_id !== req.user.id) return res.status(403).send();

    const { productId, quantity } = req.body;
    const product = await getProductById(productId);

    if (!product) return res.status(400).send();

    const order_product = await createOrderProductRow(id, productId, quantity);
    res.status(201).send(order_product);
  },
);

router.get("/:id/products", async (req, res) => {
  const { id } = req.params;
  const order = await getOrderById(id, req.user.id);

  if (!order) return res.status(404).send();

  if (order.user_id !== req.user.id) return res.status(403).send();

  const products = await getProductsInOrder(id, req.user.id);
  res.send(products);
});
