import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const componentTree = [
  {
    name: "ProductPage",
    type: "PAGE_ROOT",
    pbId: "ProductPage",
    children: [
      {
        name: "ProductForm",
        type: "SECTION",
        pbId: "ProductPage.ProductForm",
        children: [
          { name: "ProductNameInput", type: "ELEMENT", pbId: "ProductPage.ProductForm.ProductNameInput", children: [] },
          { name: "PriceInput", type: "ELEMENT", pbId: "ProductPage.ProductForm.PriceInput", children: [] },
          { name: "CategorySelect", type: "ELEMENT", pbId: "ProductPage.ProductForm.CategorySelect", children: [] },
        ],
      },
      {
        name: "ProductList",
        type: "SECTION",
        pbId: "ProductPage.ProductList",
        children: [
          { name: "ProductCard", type: "COMPONENT", pbId: "ProductPage.ProductList.ProductCard", children: [
            { name: "AddToCartButton", type: "ELEMENT", pbId: "ProductPage.ProductList.ProductCard.AddToCartButton", children: [] },
          ]},
        ],
      },
    ],
  },
];

const typeColors: Record<string, string> = {
  PAGE_ROOT: "default",
  LAYOUT: "secondary",
  SECTION: "outline",
  COMPONENT: "default",
  ELEMENT: "secondary",
};

function TreeNode({ node, depth = 0 }: { node: typeof componentTree[0]; depth?: number }) {
  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <Badge variant={(typeColors[node.type] as "default" | "secondary" | "outline") ?? "default"} className="text-[10px] px-1.5">
          {node.type}
        </Badge>
        <span className="text-sm font-medium">{node.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">{node.pbId}</span>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={child.pbId} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Project: ${id}`}
        description="Component tree and project overview"
      />

      <Tabs defaultValue="tree">
        <TabsList>
          <TabsTrigger value="tree">Component Tree</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="scans">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              {componentTree.map((node) => (
                <TreeNode key={node.pbId} node={node} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["/products", "/products/[id]", "/orders", "/orders/[id]", "/members", "/dashboard"].map(
                  (route) => (
                    <div
                      key={route}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <code className="text-sm">{route}</code>
                      <Badge variant="outline">ACTIVE</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No scan history yet. Run a scan from the Chrome Extension to populate this data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
