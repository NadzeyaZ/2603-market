import db from "#db/client";
import bycript from "bcrypt";

export async function createUser(username, password) {
  const sql = `
    INSERT INTO users
    (username, password)
    VALUES
    ($1, $2)
    RETURNING id, username
    `;
  const hashedPassword = await bycript.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT * 
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;
  const isValid = await bycript.compare(password, user.password);
  if (!isValid) return null;
  return user;
}

export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
    `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
