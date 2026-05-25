"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  FileText,
  Zap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";

interface StatsData {
  totalUsers: number;
  totalDocuments: number;
  aiCallsToday: number;
  monthlyRevenue: number;
  changes: {
    users: string;
    documents: string;
    aiCalls: string;
    revenue: string;
  };
}

interface StatsResponse {
  success: boolean;
  data: StatsData;
}

interface ChartData {
  dailyAIUsage: { date: string; count: number }[];
  userSignups: { date: string; count: number }[];
  contentTypeBreakdown: { status: string; count: number }[];
}

interface ChartResponse {
  success: boolean;
  data: ChartData;
}

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(142 76% 36%)",
  "hsl(262 83% 58%)",
  "hsl(215 16% 47%)",
];

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function tooltipDateLabel(label: unknown) {
  return typeof label === "string" ? formatShortDate(label) : String(label ?? "");
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const overviewCards = [
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: Users,
  },
  {
    key: "totalDocuments" as const,
    label: "Total Documents",
    icon: FileText,
  },
  {
    key: "aiCallsToday" as const,
    label: "AI Calls Today",
    icon: Zap,
  },
  {
    key: "monthlyRevenue" as const,
    label: "Monthly Revenue",
    icon: DollarSign,
    format: (v: number) => `$${v.toLocaleString()}`,
  },
];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, chartRes] = await Promise.all([
          apiFetch<StatsResponse>("/api/dashboard/stats"),
          apiFetch<ChartResponse>("/api/dashboard/chart-data"),
        ]);
        setStats(statsRes.data);
        setCharts(chartRes.data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartTick = { fill: "hsl(var(--muted-foreground))", fontSize: 12 };
  const gridStroke = "hsl(var(--border))";
  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
    color: "hsl(var(--foreground))",
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ key, label, icon: Icon, format }) => (
          <Card key={key} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">
                    {format
                      ? format(stats![key] as number)
                      : (stats![key] as number).toLocaleString()}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {stats!.changes[
                      key === "totalUsers"
                        ? "users"
                        : key === "totalDocuments"
                          ? "documents"
                          : key === "aiCallsToday"
                            ? "aiCalls"
                            : "revenue"
                    ]}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Daily AI Usage</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.dailyAIUsage ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={chartTick}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <YAxis tick={chartTick} axisLine={{ stroke: gridStroke }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={tooltipDateLabel}
                  />
                  <Bar
                    dataKey="count"
                    name="AI Calls"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">User Signups</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.userSignups ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={chartTick}
                    axisLine={{ stroke: gridStroke }}
                    interval="preserveStartEnd"
                    minTickGap={40}
                  />
                  <YAxis tick={chartTick} axisLine={{ stroke: gridStroke }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={tooltipDateLabel}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Signups"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Content Type Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Documents by status</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : charts?.contentTypeBreakdown.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No documents yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.contentTypeBreakdown ?? []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(props) => {
                      const payload = props.payload as {
                        status: string;
                        count: number;
                      };
                      return `${capitalize(payload.status)} (${payload.count})`;
                    }}
                  >
                    {(charts?.contentTypeBreakdown ?? []).map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    formatter={(value) => capitalize(String(value))}
                    wrapperStyle={{ color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
