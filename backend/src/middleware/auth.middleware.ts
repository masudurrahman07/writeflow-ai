import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User.model";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any; // optional attached user object
}

interface JwtPayload {
  userId: string;
}

/**
 * Protect routes – verifies the Bearer JWT in the Authorization header.
 */
export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

/**
 * requireAdmin – ensures the authenticated user has ADMIN role.
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found." });
      return;
    }
    if (user.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Admin access required." });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
}
