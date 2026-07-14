import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByProductID } from "#db/queries/orders_products";
import express from "express";
import requireUser from "#middleware/requireUser";
const router = express.Router();
export default router;

router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product) res.status(404).send("no product found");
  res.send(product);
});

router.use(requireUser);

router.get("/:id/orders", async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product) return res.status(404).send("no product found");
  const orders = await getOrdersByProductID(id, req.user.id);
  res.send(orders);
});
