import db from "#db/client";

export async function createOrderProductRow(order_id, product_id, quantity) {
  const sql = `
    INSERT INTO orders_products
    (order_id, product_id, quantity)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
  const { rows } = await db.query(sql, [order_id, product_id, quantity]);
  return rows[0];
}

export async function getOrdersByProductID(id, user_id) {
  const sql = `
        SELECT orders.*
        FROM orders
            JOIN orders_products ON orders_products.order_id = orders.id
            JOIN products ON products.id = orders_products.product_id
        WHERE products.id = $1 and orders.user_id = $2
    `;
  const { rows: orders } = await db.query(sql, [id, user_id]);
  return orders;
}

export async function getProductsInOrder(id, user_id) {
  const sql = `
        SELECT products.*
        from products
            JOIN orders_products ON products.id = orders_products.product_id
            JOIN orders ON orders.id = orders_products.order_id
        WHERE orders_products.order_id = $1 AND orders.user_id = $2
    `;
  const { rows: products } = await db.query(sql, [id, user_id]);
  return products;
}
