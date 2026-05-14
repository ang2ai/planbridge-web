import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const policies = [
  {
    id: "1",
    title: "Product name validation rules",
    type: "VALIDATION",
    scope: "ELEMENT",
    component: "ProductForm.ProductNameInput",
    version: 2,
    status: "ACTIVE",
    tags: ["product", "validation", "required"],
  },
  {
    id: "2",
    title: "Price display format",
    type: "UI_SPEC",
    scope: "COMPONENT",
    component: "ProductCard.PriceDisplay",
    version: 1,
    status: "ACTIVE",
    tags: ["product", "format", "price"],
  },
  {
    id: "3",
    title: "Discount rate limit",
    type: "BIZ_RULE",
    scope: "COMPONENT",
    component: "ProductForm.PriceInput",
    version: 3,
    status: "ACTIVE",
    tags: ["product", "discount", "business"],
  },
  {
    id: "4",
    title: "Common amount format",
    type: "UI_SPEC",
    scope: "GLOBAL",
    component: "-",
    version: 1,
    status: "ACTIVE",
    tags: ["global", "format", "amount"],
  },
  {
    id: "5",
    title: "Delete confirmation modal",
    type: "INTERACTION",
    scope: "GLOBAL",
    component: "-",
    version: 1,
    status: "ACTIVE",
    tags: ["global", "interaction", "delete"],
  },
  {
    id: "6",
    title: "Admin permission levels",
    type: "PERMISSION",
    scope: "GLOBAL",
    component: "-",
    version: 2,
    status: "ACTIVE",
    tags: ["global", "permission", "admin"],
  },
];

const typeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  VALIDATION: "default",
  UI_SPEC: "secondary",
  BIZ_RULE: "destructive",
  INTERACTION: "outline",
  DATA_SPEC: "secondary",
  PERMISSION: "default",
};

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies"
        description="Search and manage registered policies across all projects"
        action={{ label: "New Policy", icon: Plus }}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input placeholder="Search policies by title, tag, or component..." className="max-w-md" />
            <div className="flex gap-2">
              {["ALL", "VALIDATION", "UI_SPEC", "BIZ_RULE", "INTERACTION", "PERMISSION"].map(
                (type) => (
                  <Badge
                    key={type}
                    variant={type === "ALL" ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    {type.replace("_", " ")}
                  </Badge>
                )
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id} className="cursor-pointer">
                  <TableCell className="font-medium">{policy.title}</TableCell>
                  <TableCell>
                    <Badge variant={typeColors[policy.type] ?? "default"}>
                      {policy.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.scope}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {policy.component}
                  </TableCell>
                  <TableCell>v{policy.version}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {policy.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
