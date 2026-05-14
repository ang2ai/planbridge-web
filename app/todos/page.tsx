import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

interface KanbanItem {
  id: string;
  title: string;
  changeRequest: string;
  complexity: "SIMPLE" | "MODERATE" | "COMPLEX";
  assignee?: string;
}

const columns: { status: string; label: string; items: KanbanItem[] }[] = [
  {
    status: "PENDING",
    label: "Pending",
    items: [
      {
        id: "T-003",
        title: "Add dropdown component for quantity",
        changeRequest: "CR-001",
        complexity: "MODERATE",
      },
      {
        id: "T-004",
        title: "Update cart API to accept quantity",
        changeRequest: "CR-001",
        complexity: "MODERATE",
      },
      {
        id: "T-005",
        title: "Add tax calculation to price display",
        changeRequest: "CR-002",
        complexity: "SIMPLE",
      },
    ],
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    items: [
      {
        id: "T-002",
        title: "Create QuantitySelector component",
        changeRequest: "CR-001",
        complexity: "MODERATE",
        assignee: "Kim Minsu",
      },
    ],
  },
  {
    status: "DONE",
    label: "Done",
    items: [
      {
        id: "T-001",
        title: "Analyze AddToCartButton dependencies",
        changeRequest: "CR-001",
        complexity: "SIMPLE",
        assignee: "AI",
      },
    ],
  },
];

const complexityColors: Record<string, "default" | "secondary" | "outline"> = {
  SIMPLE: "secondary",
  MODERATE: "outline",
  COMPLEX: "default",
};

export default function TodosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="TODO Board"
        description="AI-generated tasks from change requests"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{column.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {column.items.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {column.items.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium leading-snug">
                          {item.title}
                        </p>
                        <Badge
                          variant={complexityColors[item.complexity] ?? "outline"}
                          className="text-[10px] shrink-0 ml-2"
                        >
                          {item.complexity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.changeRequest}</span>
                        {item.assignee && <span>{item.assignee}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {column.items.length === 0 && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      No items
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
