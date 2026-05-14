"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainCircuit } from "lucide-react";

export default function NewPlanPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="New Plan"
        description="Create a new screen planning document with AI assistance"
      />

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Describe the screen you want to plan. AI will analyze existing
            components and policies to generate a comprehensive specification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freshmart">FreshMart Admin</SelectItem>
                <SelectItem value="dashboard-v2">Dashboard v2</SelectItem>
                <SelectItem value="mobile-web">Mobile Web</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Title</label>
            <Input placeholder="e.g., Coupon Management Page" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe what this screen should do, who uses it, and any specific requirements..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reference Pages (optional)
            </label>
            <Input placeholder="e.g., /products, /orders - existing pages to reference" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
