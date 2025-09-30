import express from "express"
import { registerUser, loginUser, userLogout, sendVerifyOtp, verifyEmail, isAuthenticated, resetPassword, sendResetOtp } from "../controllers/auth.controller.js"
import { userAuth } from "../middleware/userAuth.middleware.js"

const router = express.Router();


// Auth Route ---> /api/v1/auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userLogout);

// Verify OTP Route ---> /api/v1/auth/verify-otp
router.post("/verify-otp", userAuth, verifyEmail);

// Send OTP Route ---> /api/v1/auth/send-otp
router.post("/send-otp", userAuth, sendVerifyOtp);

// isAuthenticated Route ---> /api/v1/auth/is-authenticated
router.post("/is-auth", userAuth, isAuthenticated);

router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);
export default router;
