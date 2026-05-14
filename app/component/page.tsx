import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";

export default async function ComponentDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ pbId?: string; componentName?: string; pageRoute?: string }>;
}) {
  const { pbId, componentName, pageRoute } = await searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        title={componentName ?? pbId ?? "Component Detail"}
        description={`Route: ${pageRoute ?? "N/A"} | PB ID: ${pbId ?? "N/A"}`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">PB ID</dt>
                  <dd className="font-mono mt-1">{pbId ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Component Name</dt>
                  <dd className="mt-1">{componentName ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Page Route</dt>
                  <dd className="font-mono mt-1">{pageRoute ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="mt-1">
                    <Badge variant="outline">ELEMENT</Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Tabs defaultValue="policies">
            <TabsList>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="changes">Change History</TabsTrigger>
              <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
            </TabsList>
            <TabsContent value="policies" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Policies</CardTitle>
                  <CardDescription>
                    Policies registered for this component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No policies registered yet. Select an element via the Chrome Extension to register policies.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="changes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No change requests for this component.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="snapshots" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Component Snapshots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Snapshots will appear after scanning.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="text-muted-foreground">ProductPage</div>
                <div className="pl-4 text-muted-foreground">ProductForm</div>
                <div className="pl-8 font-medium">
                  {componentName ?? "Component"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Props</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
                {JSON.stringify(
                  { variant: "primary", disabled: false },
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
