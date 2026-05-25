import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.model";
import { Document } from "../models/Document.model";
import { AIHistory } from "../models/AIHistory.model";
import { AuthRequest } from "../middleware/auth.middleware";

interface UpdateUserBody {
  name?: string;
  bio?: string;
  avatar?: string;
}

async function getUserStats(userId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [documentsThisMonth, wordAgg, aiCallsMade] = await Promise.all([
    Document.countDocuments({
      userId: userObjectId,
      createdAt: { $gte: startOfMonth },
    }),
    Document.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$wordCount" } } },
    ]),
    AIHistory.countDocuments({ userId: userObjectId }),
  ]);

  return {
    documentsThisMonth,
    totalWordsGenerated: wordAgg[0]?.total ?? 0,
    aiCallsMade,
  };
}

export async function getUserById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    if (id !== req.userId) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const stats = await getUserStats(id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio ?? "",
          avatar: user.avatar ?? "",
          plan: user.plan,
          role: user.role,
        },
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { name, bio, avatar } = req.body as UpdateUserBody;

    if (!req.userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    if (id !== req.userId) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400).json({ success: false, message: "Name cannot be empty." });
        return;
      }
      user.name = name.trim();
    }
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const stats = await getUserStats(id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio ?? "",
          avatar: user.avatar ?? "",
          plan: user.plan,
          role: user.role,
        },
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search = "", page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        banned: user.banned ?? false,
        createdAt: user.createdAt,
      })),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ success: false, message: "User ID and role are required." });
      return;
    }

    if (role !== "USER" && role !== "ADMIN") {
      res.status(400).json({ success: false, message: "Invalid role. Must be USER or ADMIN." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        banned: user.banned ?? false,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleUserBanned(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    user.banned = !user.banned;
    await user.save();

    res.json({
      success: true,
      message: `User ban status updated successfully.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        banned: user.banned ?? false,
      },
    });
  } catch (error) {
    next(error);
  }
}
