"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";

interface AIHistoryRecord {
  _id: string;
  agentUsed: string;
  promptSnippet?: string;
  tokensUsed: number;
  createdAt: string;
}

interface AIHistoryResponse {
  success: boolean;
  data: AIHistoryRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const AGENT_FILTERS = [
  { value: "all", label: "All Agents" },
  { value: "Content Draft", label: "Content Draft" },
  { value: "Rewrite Agent", label: "Rewrite Agent" },
  { value: "Chat Assistant", label: "Chat Assistant" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateSnippet(text: string, max = 80) {
  if (!text) return "—";
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

export default function AIHistoryPage() {
  const [agentFilter, setAgentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<AIHistoryRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (agentFilter !== "all") params.set("agentUsed", agentFilter);

      const res = await apiFetch<AIHistoryResponse>(
        `/api/ai/history?${params.toString()}`
      );
      setRecords(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load AI history."
      );
    } finally {
      setLoading(false);
    }
  }, [page, agentFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Track your AI agent usage across WriteFlow.
        </p>
        <Select
          value={agentFilter}
          onValueChange={(v) => {
            setAgentFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by agent" />
          </SelectTrigger>
          <SelectContent>
            {AGENT_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Agent Used
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">
                  Prompt Snippet
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Tokens
                </th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3" colSpan={4}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center">
                    <p className="text-muted-foreground mb-4">
                      No AI usage yet. Try generating some content →
                    </p>
                    <Button asChild>
                      <Link href="/editor">Open Editor</Link>
                    </Button>
                  </td>
                </tr>
              )}

              {!loading &&
                records.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.agentUsed}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] md:max-w-xs truncate hidden sm:table-cell">
                      {truncateSnippet(row.promptSnippet ?? "")}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {row.tokensUsed?.toLocaleString() ?? 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && records.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
