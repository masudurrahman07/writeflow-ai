import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { env } from "../config/env";
import crypto from "crypto";
import https from "https";

interface JwtPayload {
  userId: string;
}

function signAccessToken(userId: string): string {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

// POST /api/auth/register
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: "Email already in use." });
      return;
    }

    const user = await User.create({ name, email, password });

    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: "Invalid credentials." });
      return;
    }

    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          plan: user.plan,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/refresh-token
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body as { token: string };
    if (!token) {
      res.status(400).json({ success: false, message: "Refresh token required." });
      return;
    }
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid token." });
      return;
    }
    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));
    res.json({
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}

function getGoogleTokenInfo(
  idToken: string
): Promise<{ email?: string; email_verified?: string; name?: string; aud?: string }> {
  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("id_token", idToken);

  return new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += String(chunk);
        });
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

export async function googleLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) {
      res.status(400).json({ success: false, message: "idToken is required." });
      return;
    }

    const info = await getGoogleTokenInfo(idToken);
    if (!info.email || info.email_verified !== "true") {
      res.status(401).json({ success: false, message: "Invalid Google token." });
      return;
    }
    if (env.GOOGLE_CLIENT_ID && info.aud && info.aud !== env.GOOGLE_CLIENT_ID) {
      res.status(401).json({ success: false, message: "Invalid Google token." });
      return;
    }

    const email = info.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      user = await User.create({
        name: info.name ?? email.split("@")[0],
        email,
        password: randomPassword,
      });
    }

    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
