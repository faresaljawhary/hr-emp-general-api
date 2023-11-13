import express from "express";
import {
  addGeneralApplication,
  getAllGeneralApplication,
  updateDownloadValue,
  checkDuplicationUser,
} from "./controller.js";
import multer from "multer";
import uploadMiddleware from "../../../middlewares/validators/uploadMiddleware.js";
import verifyBearerToken from "../../../middlewares/validators/check-auth.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));
router.post(
  "/general-from",
  uploadMiddleware.upload.array("images"),
  addGeneralApplication
);
router.get(
  "/general-from",
  verifyBearerToken,
  getAllGeneralApplication
);
router.put("/general-from", verifyBearerToken, updateDownloadValue);
router.get("/general-from/duplicate/:userId", checkDuplicationUser);

export default router;
