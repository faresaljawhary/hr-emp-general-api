import express from "express";
import { getAttachmentsByUserId } from "./controller.js";
import verifyBearerToken from "../../../middlewares/validators/check-auth.js";

const router = express.Router();

router.get("/:userId", verifyBearerToken, getAttachmentsByUserId);

export default router;
