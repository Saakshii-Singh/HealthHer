import express from "express";
import { getCycleLogs, createCycleLog } from "../controllers/periodController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getCycleLogs)
  .post(protect, createCycleLog);

export default router;