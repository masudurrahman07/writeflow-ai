"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  banned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/users?search=${encodeURIComponent(search)}&page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setTotalPages(data.meta?.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  const columns: Array<{
    key: keyof UserRow;
    label: string;
    render?: (row: UserRow) => React.ReactNode;
  }> = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row: UserRow) => (
        <Badge variant={row.role === "ADMIN" ? "default" : "secondary"}>{row.role}</Badge>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row: UserRow) => (
        <Badge variant={row.plan === "pro" ? "default" : "outline"}>{row.plan}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Join Date",
      render: (row: UserRow) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "banned",
      label: "Status",
      render: (row: UserRow) => (
        <Badge variant={row.banned ? "destructive" : "secondary"}>{row.banned ? "Banned" : "Active"}</Badge>
      ),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleRoleToggle(user: UserRow) {
    // TODO: Implement role toggle
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleBanToggle(user: UserRow) {
    // TODO: Implement ban/unban toggle
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <DataTable
            columns={columns}
            data={users}
            actions={(row: UserRow) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRoleToggle(row)}
                  disabled={loading}
                >
                  {row.role === "ADMIN" ? "Make User" : "Make Admin"}
                </Button>
                <Button
                  size="sm"
                  variant={row.banned ? "secondary" : "destructive"}
                  onClick={() => handleBanToggle(row)}
                  disabled={loading}
                >
                  {row.banned ? "Unban" : "Ban"}
                </Button>
              </div>
            )}
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
