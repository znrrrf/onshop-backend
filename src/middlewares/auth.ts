import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth";

interface JwtPayload {
  id: string; // atau number sesuai tipe id di database
}



export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token required" });
    }

    const token = authHeader.split(" ")[1]; // ambil token setelah "Bearer"
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // simpan userId dari token ke request object
    console.log("check decoded: ", decoded)
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.log("Error auth middleware :", err)
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};