import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReviewsPage() {
  return (
    <Card className="border-border max-w-lg">
      <CardHeader>
        <CardTitle>Manage Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Review moderation tools will be available here.
        </p>
      </CardContent>
    </Card>
  );
}
