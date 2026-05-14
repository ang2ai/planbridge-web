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
import { Plus, Layers, Shield, FileText } from "lucide-react";

const projects = [
  {
    id: "freshmart",
    name: "FreshMart Admin",
    description: "Fresh food e-commerce admin system",
    framework: "NEXTJS",
    status: "ACTIVE",
    components: 472,
    policies: 156,
    pages: 12,
  },
  {
    id: "dashboard-v2",
    name: "Dashboard v2",
    description: "Internal analytics dashboard redesign",
    framework: "REACT",
    status: "ACTIVE",
    components: 234,
    policies: 89,
    pages: 8,
  },
  {
    id: "mobile-web",
    name: "Mobile Web",
    description: "Mobile-first customer web application",
    framework: "NEXTJS",
    status: "ACTIVE",
    components: 186,
    policies: 45,
    pages: 15,
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your registered projects"
        action={{ label: "New Project", icon: Plus }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant="outline">{project.framework}</Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {project.components}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    {project.policies}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {project.pages} pages
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
