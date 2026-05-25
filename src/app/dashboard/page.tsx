import Link from "next/link";
import { FileText, PenLine } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Welcome back. Manage your documents and AI writing tools.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              My Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View, edit, and manage your saved drafts and published content.
            </p>
            <Button asChild>
              <Link href="/dashboard/documents">Open Documents</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PenLine className="h-5 w-5" />
              AI Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate content, rewrite text, and chat with your writing assistant.
            </p>
            <Button asChild variant="secondary">
              <Link href="/editor">Open Editor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
