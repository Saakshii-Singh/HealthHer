import express from "express";
import { getMoodLogs, createMoodLog } from "../controllers/moodController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getMoodLogs)
  .post(protect, createMoodLog);

export default router;