import nodemailer from 'nodemailer';
import {Request, Response} from "express";
import dotenv from 'dotenv';
import { validateRequiredFields } from "../utils/validators";
import bcrypt from "bcrypt";
import * as UserService from "../services/users";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth";

dotenv.config();

type DatauserType = {id: number, username: string, email: string, password: string}

export async function sendVerification(req: Request, res: Response) {
    try {
        const {email} = req.body

        if (!email) {
             return res
            .status(400)
            .json({ error: `Email is required!` });
        }

        const firstname= 'new'
        const lastname= 'user'
        const username = email.split("@")[0];
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

        await UserService.insertOtp(email, otp, expiresAt, username, firstname, lastname)

        console.log("env :", process.env.EMAIL_PASS)

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
         console.log("Error sendverification :", err)
        res.status(500).json({error: "Internal server error, failed to sendVerification!"})
    }
}

export async function register(req: Request, res: Response) {
    try {
        
        const {firstname, lastname, username, email, password} = req.body
        const missing = validateRequiredFields([firstname, lastname, username, email, password]);

        if (missing.length > 0) {
            return res
            .status(400)
            .json({ error: `Missing required fields: ${missing.join(", ")}` });
        }

        const existingUser = await UserService.checkUserExists(email);
            
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }

        // Hash password sebelum simpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert ke DB
        const user = await UserService.registerUser(firstname, lastname, username, email, hashedPassword);

        // Balikan user baru (tanpa password)
        return res.status(201).json({
            message: "success",
            data: user,
        });


    } catch (err: any) {
        console.log("Error register :", err)
        res.status(500).json({error: "Internal server error, failed to register!"})
    }
}

export async function login(req: Request, res: Response) {
    try {

        const {email, password} = req.body

        const result: DatauserType  = await UserService.checkUserExists(email);

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        // // Bandingkan password input dengan hash di DB
        const isMatch = await bcrypt.compare(password, result.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // (Opsional) Buat token JWT untuk session
        const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

        if (!token) {
            return res.status(401).json({ error: "Failed to generate token" });
        }

        const isSuccess = await UserService.insertToken(token, email)

        if (!isSuccess) {
            return res.status(401).json({ error: "Failed to input token" });
        }

        return res.status(200).json({
            message: "success",
            data: token,
        });

    } catch (err: any) {
        console.log("Error login :", err)
        res.status(500).json({error: "Internal server error, failed to login!"})
    }
}

export async function detailUser(req: AuthenticatedRequest, res: Response) {
    try {

        const userId = req?.userId
        console.log("check userId :", req.userId)

        if (!userId) {
            return res.status(401).json({ error: "User id is not found or undefined!" })
        }

        const userData = await UserService.checkUserExistsById(userId);

        return res.status(200).json({
            message: "success",
            data: userData,
        });

    } catch (err) {
        console.log("Error detailUser :", err)
        res.status(500).json({error: "Internal server error, failed to get detailUser!"})
    }
}