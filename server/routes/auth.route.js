import express from "express"
import { registerUser, loginUser, userLogout } from "../controllers/auth.controller.js"

const router = express.Router();


// Auth Route ---> /api/v1/auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userLogout);

export default router;
