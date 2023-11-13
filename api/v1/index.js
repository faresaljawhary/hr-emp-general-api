import express from "express";
import generalRouter from "./general/index.js";
import signInRouter from "./signin/index.js";

const router = express.Router();
router.get("/refresh-api", (req, res, next) => {
  res.status(200).send("api refreshed");
});
router.use("/general", generalRouter);
router.use("/authentication", signInRouter);

export default router;
