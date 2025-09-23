import express from "express"
import { registerUser, loginUser, userLogout, sendVerifyOtp, verifyEmail } from "../controllers/auth.controller.js"
import { userAuth } from "../middleware/userAuth.middleware.js"

const router = express.Router();


// Auth Route ---> /api/v1/auth
router.post("/register", userAuth, registerUser);
router.post("/login", userAuth, loginUser);
router.post("/logout", userAuth, userLogout);

// Verify OTP Route ---> /api/v1/auth/verify-otp
router.post("/verify-otp", userAuth, verifyEmail);

// Send OTP Route ---> /api/v1/auth/send-otp
router.post("/send-otp", userAuth, sendVerifyOtp);

export default router;
