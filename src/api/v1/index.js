import express from "express";
import generalRouter from "./general/index.js";
import signInRouter from "./signin/index.js";

const router = express.Router();
router.use("/general", generalRouter);
router.use("/authentication", signInRouter);

export default router;
