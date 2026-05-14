import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Plus } from "lucide-react";

const plans = [
  {
    id: "plan-001",
    title: "Coupon Management Page",
    description: "New admin page for creating and managing discount coupons",
    status: "DRAFT",
    createdBy: "Park Jihyun",
    createdAt: "2026-03-31",
    componentsReused: 12,
    policiesApplied: 8,
  },
  {
    id: "plan-002",
    title: "Order Return/Refund Flow",
    description: "Return and refund processing workflow for order management",
    status: "AI_ANALYZING",
    createdBy: "Park Jihyun",
    createdAt: "2026-03-29",
    componentsReused: 6,
    policiesApplied: 15,
  },
  {
    id: "plan-003",
    title: "Seller Dashboard",
    description: "Statistics and sales overview dashboard for sellers",
    status: "COMPLETED",
    createdBy: "Park Jihyun",
    createdAt: "2026-03-25",
    componentsReused: 18,
    policiesApplied: 22,
  },
];

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  DRAFT: "secondary",
  AI_ANALYZING: "outline",
  REVIEW: "default",
  COMPLETED: "secondary",
};

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        description="Create and manage screen planning documents"
        action={{ label: "New Plan", icon: Plus, href: "/plans/new" }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Link key={plan.id} href={`/plans/${plan.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={statusColors[plan.status] ?? "default"}>
                    {plan.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {plan.createdAt}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{plan.componentsReused} components reused</span>
                  <span>{plan.policiesApplied} policies applied</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  by {plan.createdBy}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
