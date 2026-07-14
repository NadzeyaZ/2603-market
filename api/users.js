import express from "express";
import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
const router = express.Router();
export default router;

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) {
      return res.status(401).send("Unauthorized user");
    }
    const token = createToken({ id: user.id });
    res.status(200).send(token);
  },
);
