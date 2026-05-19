import express from "express";
import { getMessagesByRoom, createMessage } from "../controllers/communityController.js";

const router = express.Router();

router.get("/:room", getMessagesByRoom);
router.post("/", createMessage);

export default router;