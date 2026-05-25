import express from "express";
import { registerUser, loginUser, getUserProfile, verifyEmail, resendVerificationCode } from "../controllers/authController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.get("/profile", protect, getUserProfile);

export default router;