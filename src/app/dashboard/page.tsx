import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Manage your writing projects and AI-generated content."
        />
        {/* Dashboard content goes here */}
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Your projects will appear here.
        </div>
      </DashboardShell>
    </div>
  );
}
