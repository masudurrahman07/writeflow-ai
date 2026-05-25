import { Response, NextFunction } from "express";
import { User } from "../models/User.model";
import { Document } from "../models/Document.model";
import { AIHistory } from "../models/AIHistory.model";
import { AuthRequest } from "../middleware/auth.middleware";

function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fillDailySeries(
  days: number,
  aggregated: { _id: string; count: number }[]
): { date: string; count: number }[] {
  const map = new Map(aggregated.map((a) => [a._id, a.count]));
  const result: { date: string; count: number }[] = [];
  const today = startOfDay();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }

  return result;
}

export async function getStats(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const today = startOfDay();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalUsers,
      totalDocuments,
      aiCallsToday,
      aiCallsYesterday,
      newUsersThisWeek,
      newDocsThisWeek,
    ] = await Promise.all([
      User.countDocuments(),
      Document.countDocuments(),
      AIHistory.countDocuments({ createdAt: { $gte: today } }),
      AIHistory.countDocuments({
        createdAt: { $gte: yesterday, $lt: today },
      }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      Document.countDocuments({ createdAt: { $gte: weekAgo } }),
    ]);

    const aiCallsDelta = aiCallsToday - aiCallsYesterday;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        aiCallsToday,
        monthlyRevenue: 0,
        changes: {
          users: `+${newUsersThisWeek} this week`,
          documents: `+${newDocsThisWeek} this week`,
          aiCalls:
            aiCallsDelta >= 0
              ? `+${aiCallsDelta} from yesterday`
              : `${aiCallsDelta} from yesterday`,
          revenue: "No billing data",
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getChartData(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sevenDaysAgo = startOfDay();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const thirtyDaysAgo = startOfDay();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const [dailyAIRaw, signupsRaw, statusBreakdown] = await Promise.all([
      AIHistory.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Document.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dailyAIUsage = fillDailySeries(7, dailyAIRaw);
    const userSignups = fillDailySeries(30, signupsRaw);

    const contentTypeBreakdown = statusBreakdown.map(
      (item: { _id: string; count: number }) => ({
        status: item._id ?? "unknown",
        count: item.count,
      })
    );

    res.json({
      success: true,
      data: {
        dailyAIUsage,
        userSignups,
        contentTypeBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
}
