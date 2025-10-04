import express from "express"
import { registerUser, loginUser, userLogout, sendVerifyOtp, verifyEmail, isAuthenticated, resetPassword, sendResetOtp } from "../controllers/auth.controller.js"
import { userAuth } from "../middleware/userAuth.middleware.js"

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userLogout);
router.post("/is-auth", userAuth, isAuthenticated);
router.post("/send-otp", userAuth, sendVerifyOtp);
router.post("/verify-otp", userAuth, verifyEmail);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

export default router;
