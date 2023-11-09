import express from "express";
import signin from "./controller.js";
import signinValidator from "../../../middlewares/validators/signin.js";

const router = express.Router();

router.post("/signin", signinValidator, signin);

export default router;
