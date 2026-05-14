import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  FolderKanban,
  Layers,
  Shield,
  GitPullRequestArrow,
} from "lucide-react";

const stats = [
  { label: "Projects", value: "3", icon: FolderKanban, change: "+1 this month" },
  { label: "Components", value: "472", icon: Layers, change: "+28 this week" },
  { label: "Policies", value: "156", icon: Shield, change: "+12 this week" },
  { label: "Change Requests", value: "8", icon: GitPullRequestArrow, change: "3 in progress" },
];

const recentChanges = [
  {
    id: "1",
    title: "Add quantity selector to cart button",
    component: "ProductCard.AddToCartButton",
    status: "IN_PROGRESS" as const,
    requestedBy: "Park Jihyun",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Update price format to include tax",
    component: "ProductCard.PriceDisplay",
    status: "READY" as const,
    requestedBy: "Park Jihyun",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Category filter redesign",
    component: "ProductList.CategoryFilter",
    status: "DONE" as const,
    requestedBy: "Park Jihyun",
    createdAt: "1 day ago",
  },
];

const statusColors: Record<string, string> = {
  DRAFT: "secondary",
  AI_PROCESSING: "outline",
  READY: "default",
  IN_PROGRESS: "default",
  TESTING: "outline",
  DONE: "secondary",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your PlanBridge workspace"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Change Requests</CardTitle>
            <CardDescription>
              Latest changes across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChanges.map((change) => (
                <div
                  key={change.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{change.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {change.component}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        (statusColors[change.status] as "default" | "secondary" | "outline") ??
                        "default"
                      }
                    >
                      {change.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors">
                <p className="text-sm font-medium">Scan Page Components</p>
                <p className="text-xs text-muted-foreground">
                  Detect and register new components from a page
                </p>
              </div>
              <div className="rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors">
                <p className="text-sm font-medium">Create New Plan</p>
                <p className="text-xs text-muted-foreground">
                  Start designing a new screen with AI assistance
                </p>
              </div>
              <div className="rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors">
                <p className="text-sm font-medium">Search Policies</p>
                <p className="text-xs text-muted-foreground">
                  Find existing policies for reuse
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
