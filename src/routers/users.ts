import {Router, Request, Response} from "express";
import dotenv from 'dotenv';
import { detailUser, login, register, sendVerification } from "../controllers/users";
import { authMiddleware } from "../middlewares/auth";
dotenv.config();
const router = Router();


router.post("/register", register);
router.post("/login", login);
router.get("/detail", authMiddleware, detailUser);
router.post("/sendOtp", sendVerification);


export default router;