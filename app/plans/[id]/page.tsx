import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupon Management Page"
        description={`Plan ID: ${id}`}
      />

      <div className="flex gap-2">
        <Badge variant="secondary">DRAFT</Badge>
        <Badge variant="outline">FreshMart Admin</Badge>
        <Badge variant="outline">by Park Jihyun</Badge>
      </div>

      <Tabs defaultValue="spec">
        <TabsList>
          <TabsTrigger value="spec">Specification</TabsTrigger>
          <TabsTrigger value="components">Component Map</TabsTrigger>
          <TabsTrigger value="policies">Applied Policies</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Check</TabsTrigger>
        </TabsList>

        <TabsContent value="spec" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Specification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                The AI-generated specification will appear here after analysis.
                It will include screen layout suggestions, component reuse
                recommendations, and policy compliance checks.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reusable Components</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI will suggest existing components that can be reused for this
                new screen.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Applicable Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Global and relevant policies that should be applied to this new
                screen.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI will check for conflicts between the new plan and existing
                policies.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
