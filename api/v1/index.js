import express from "express";
import generalRouter from "./general/index.js";
import signInRouter from "./signin/index.js";
import cors from "cors";

const router = express.Router();
router.use("/general", cors(), generalRouter);
router.use("/authentication", signInRouter);

export default router;
