import express from "express";
import {
  addWorkerApplication,
  getAllWorkersApplications,
  changePriorityWorker,
  getAllWorkersEmployees,
  changeStatusWorker,
} from "./controller.js";
import verifyBearerToken from "../../../middlewares/validators/check-auth.js";
import multer from "multer";
import uploadMiddleware from "../../../middlewares/validators/uploadMiddleware.js";

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
  "/workers-from",
  verifyBearerToken,
  uploadMiddleware.upload.array("images"),
  addWorkerApplication
);

router.get("/workers-from", verifyBearerToken, getAllWorkersApplications);
router.get("/employees", verifyBearerToken, getAllWorkersEmployees);
router.put("/priority/:userId", verifyBearerToken, changePriorityWorker);
router.put("/status/:userId", verifyBearerToken, changeStatusWorker);

export default router;
