import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import app from "./src/app.js";

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
