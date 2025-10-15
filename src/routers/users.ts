import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import {
  checkOtp,
  detailUser,
  login,
  register,
  sendVerification,
} from "../controllers/users";
import { authMiddleware } from "../middlewares/auth";
dotenv.config();
const router = Router();

// POST
router.post("/register", register);
router.post("/login", login);
router.post("/sendOtp", sendVerification);

// GET
router.get("/otp", checkOtp);
router.get("/detail", authMiddleware, detailUser);

export default router;
