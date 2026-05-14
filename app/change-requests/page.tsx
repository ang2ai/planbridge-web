import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const changeRequests = [
  {
    id: "CR-001",
    title: "Add quantity selector to cart button",
    component: "ProductCard.AddToCartButton",
    requestedBy: "Park Jihyun",
    priority: "HIGH",
    status: "IN_PROGRESS",
    todos: { total: 4, done: 1 },
    createdAt: "2026-03-30",
  },
  {
    id: "CR-002",
    title: "Update price format to include tax",
    component: "ProductCard.PriceDisplay",
    requestedBy: "Park Jihyun",
    priority: "MEDIUM",
    status: "READY",
    todos: { total: 3, done: 0 },
    createdAt: "2026-03-30",
  },
  {
    id: "CR-003",
    title: "Category filter redesign",
    component: "ProductList.CategoryFilter",
    requestedBy: "Park Jihyun",
    priority: "LOW",
    status: "DONE",
    todos: { total: 5, done: 5 },
    createdAt: "2026-03-28",
  },
  {
    id: "CR-004",
    title: "Add minors restriction for alcohol category",
    component: "CategorySelect",
    requestedBy: "Park Jihyun",
    priority: "CRITICAL",
    status: "AI_PROCESSING",
    todos: { total: 0, done: 0 },
    createdAt: "2026-03-31",
  },
];

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  AI_PROCESSING: "outline",
  READY: "default",
  IN_PROGRESS: "default",
  TESTING: "outline",
  DONE: "secondary",
  REJECTED: "destructive",
};

const priorityColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "outline",
  HIGH: "default",
  CRITICAL: "destructive",
};

export default function ChangeRequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Requests"
        description="Track and manage component change requests"
        action={{ label: "New Request", icon: Plus }}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>TODO Progress</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeRequests.map((cr) => (
                <TableRow key={cr.id} className="cursor-pointer">
                  <TableCell className="font-mono text-xs">{cr.id}</TableCell>
                  <TableCell className="font-medium">{cr.title}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {cr.component}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityColors[cr.priority] ?? "default"}>
                      {cr.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[cr.status] ?? "default"}>
                      {cr.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cr.todos.total > 0
                      ? `${cr.todos.done}/${cr.todos.total}`
                      : "-"}
                  </TableCell>
                  <TableCell>{cr.requestedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cr.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
