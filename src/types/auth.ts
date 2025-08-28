import {Router, Request, Response} from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}