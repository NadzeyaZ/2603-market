import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { createOrderProductRow } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  //1. one user
  const user = await createUser("User1", process.env.PASSWORD);
  //2. 10 products
  for (let i = 1; i <= 10; i++) {
    const title = faker.lorem.word();
    const description = faker.lorem.sentence();
    const price = faker.number.float({ min: 10, max: 100, fractionDigits: 2 });
    await createProduct(title, description, price);
  }
  // 3. one order
  const date = faker.date.between({ from: "2025-01-01", to: "2026-01-01" });
  const note = faker.lorem.sentence();
  const order = await createOrder(date, note, user.id);
  // 4. one order with 5 products
  for (let i = 1; i <= 5; i++) {
    const productId = Math.floor(Math.random() * 10) + 1;
    const quantity = faker.number.int({ min: 1, max: 10 });
    await createOrderProductRow(order.id, productId, quantity);
  }
}
