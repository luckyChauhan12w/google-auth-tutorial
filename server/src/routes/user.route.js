import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { userAuth } from "../middleware/userAuth.middleware.js";

const router = express.Router();

router.get("/get-user", userAuth, getUser);

export default router;
