import nodemailer from "nodemailer";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { validateRequiredFields } from "../utils/validators";
import bcrypt from "bcrypt";
import * as UserService from "../services/users";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth";
import { admin } from "../lib/firebaseAdmin";
import dayjs from "dayjs";

dotenv.config();

type DatauserType = {
  id: number;
  username: string;
  email: string;
  password: string;
};

// create verification and init email user
export async function sendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: `Email is required!` });
    }

    // const firstname = "new";
    // const lastname = "user";
    // const username = email.split("@")[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = dayjs().add(5, "minute").toDate();

    await UserService.insertOtp(
      email,
      otp,
      expiresAt
      // username,
    );

    console.log("env :", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${otp}`,
    });

    return res.status(201).json({
      message: "success",
      data: {},
    });
  } catch (err) {
    console.log("Error sendverification :", err);
    res
      .status(500)
      .json({ message: "Internal server error, failed to sendVerification!" });
  }
}

export async function checkOtp(req: Request, res: Response) {
  try {
    const { otp, email } = req.query;

    const missing = validateRequiredFields([otp, email]);

    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const dataOtp = await UserService.getOtpByEmail(email as string);

    if (!dataOtp?.otp) {
      return res.status(401).json({ message: `Cannot find your OTP!` });
    }

    if (dataOtp?.otp !== otp) {
      console.log("check otp :", dataOtp?.otp, otp);
      return res.status(401).json({
        message: `Otp is is not match!`,
        data: { verfied: false, otp: "" },
      });
    }
    const now = dayjs();
    const expiredOtp = dayjs(dataOtp?.otp_expired);

    if (now.isAfter(expiredOtp)) {
      return res.status(401).json({
        message: `Your OTP is expired!`,
        data: { verified: false, otp: "" },
      });
    }

    await UserService.verificationUser(email as string);

    return res.status(201).json({
      message: "success",
      data: {
        otp: dataOtp.otp,
        verified: true,
      },
    });
  } catch (err: any) {
    console.log("Error checkOtp :", err);
    res
      .status(500)
      .json({ message: "Internal server error, failed to checkOtp!" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;
    const missing = validateRequiredFields([email, password, username]);

    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const existingUser = await UserService.checkUserExists(email);
    console.log("existingUser :", existingUser);

    if (existingUser?.email && existingUser?.password) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password sebelum simpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke DB
    const user = await UserService.registerUser(
      email,
      hashedPassword,
      username
    );

    // Balikan user baru (tanpa password)
    return res.status(201).json({
      message: "success",
      data: user,
    });
  } catch (err: any) {
    console.log("Error register :", err);
    res
      .status(500)
      .json({ message: "Internal server error, failed to register!" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result: DatauserType = await UserService.checkUserExists(email);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    // // Bandingkan password input dengan hash di DB
    const isMatch = await bcrypt.compare(password, result.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // (Opsional) Buat token JWT untuk session
    const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    if (!token) {
      return res.status(401).json({ error: "Failed to generate token" });
    }

    const isSuccess = await UserService.insertToken(token, email);

    if (!isSuccess) {
      return res.status(401).json({ error: "Failed to input token" });
    }

    return res.status(200).json({
      message: "success",
      data: token,
    });
  } catch (err: any) {
    console.log("Error login :", err);
    res.status(500).json({ error: "Internal server error, failed to login!" });
  }
}

export async function detailUser(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req?.userId;
    console.log("check userId :", req.userId);

    if (!userId) {
      return res
        .status(401)
        .json({ error: "User id is not found or undefined!" });
    }

    const userData = await UserService.checkUserExistsById(userId);

    return res.status(200).json({
      message: "success",
      data: userData,
    });
  } catch (err) {
    console.log("Error detailUser :", err);
    res
      .status(500)
      .json({ error: "Internal server error, failed to get detailUser!" });
  }
}
