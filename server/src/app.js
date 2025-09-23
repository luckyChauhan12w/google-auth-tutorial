import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "../routes/auth.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);

export default app;
