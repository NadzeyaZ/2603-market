import express from "express";
import requireUser from "#middleware/requireUser";
import { createOrder, getAllOrders, getOrderById } from "#db/queries/orders";
const router = express.Router();
export default router;

router.use(requireUser);

router.post("/", async (req, res) => {
  if (!req.body.date)
    return res.status(400).send("Request body - date - is required.");
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
