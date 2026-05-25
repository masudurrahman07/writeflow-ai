import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTemplatesPage() {
  return (
    <Card className="border-border max-w-lg">
      <CardHeader>
        <CardTitle>Manage Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Template management tools will be available here.
        </p>
      </CardContent>
    </Card>
  );
}
