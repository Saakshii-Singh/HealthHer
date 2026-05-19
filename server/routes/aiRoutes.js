import express from "express";
import { generateCompanionResponse } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", generateCompanionResponse);

export default router;