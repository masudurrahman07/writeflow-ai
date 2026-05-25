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
