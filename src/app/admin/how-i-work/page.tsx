"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveHowIWorkAction } from "@/actions/cms";
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  ListOrdered,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface StepItem {
  stepNumber: string;
  title: string;
  description: string;
  order: number;
  isPublished?: boolean;
}

export default function HowIWorkAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [steps, setSteps] = React.useState<StepItem[]>([]);
  const [communicationLine, setCommunicationLine] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/how-i-work");
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setSteps(d.steps || []);
          setCommunicationLine(d.communicationLine || "");
          setIsPublished(d.isPublished !== false);
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to load How I Work",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleStepChange = (
    index: number,
    field: "stepNumber" | "title" | "description",
    val: string
  ) => {
    setHasUnsavedChanges(true);
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const addStep = () => {
    setHasUnsavedChanges(true);
    const nextNum = (steps.length + 1).toString().padStart(2, "0");
    setSteps((prev) => [
      ...prev,
      {
        stepNumber: nextNum,
        title: "Step Title",
        description: "Clear explanation of what happens in this step.",
        order: prev.length + 1,
        isPublished: true,
      },
    ]);
  };

  const removeStep = (index: number) => {
    setHasUnsavedChanges(true);
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    setHasUnsavedChanges(true);
    setSteps((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHowIWorkAction({
        steps: steps.map((s, idx) => ({
          stepNumber: s.stepNumber || `0${idx + 1}`,
          title: s.title,
          description: s.description,
          order: s.order ?? idx + 1,
          isPublished: s.isPublished !== false,
        })),
        communicationLine,
        isPublished,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "Process Section Saved",
        description: "How I Work steps and communication line updated successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to save process steps.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-primary" />
            How I Work (Process)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            4-step workflow explaining your discovery, quote, demo, and 30-day launch support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/#process" target="_blank">
              <ExternalLink className="w-4 h-4" />
              Live Preview
            </Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs flex items-center justify-between">
          <span>You have unsaved changes in this form.</span>
          <span className="font-semibold underline cursor-pointer" onClick={handleSubmit}>
            Save now
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Section Header & Guarantee</CardTitle>
                <CardDescription>Configure communication line and visibility</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="process-published" className="text-xs text-muted-foreground">
                  {isPublished ? "Published" : "Draft / Hidden"}
                </Label>
                <Switch
                  id="process-published"
                  checked={isPublished}
                  onCheckedChange={(checked) => {
                    setIsPublished(checked);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comm-line">Communication & Guarantee Line</Label>
              <Input
                id="comm-line"
                value={communicationLine}
                onChange={(e) => {
                  setCommunicationLine(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="One point of contact, WhatsApp/email updates, weekly demo call."
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Workflow Steps</CardTitle>
                <CardDescription>Step-by-step milestones presented to prospective clients</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1.5 border-primary/30">
                <Plus className="w-4 h-4 text-primary" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/70 bg-secondary/10 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                      {step.stepNumber}
                    </span>
                    <Input
                      value={step.stepNumber}
                      onChange={(e) => handleStepChange(idx, "stepNumber", e.target.value)}
                      placeholder="01"
                      className="w-16 text-center font-mono text-xs"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveStep(idx, "up")}
                      className="p-1.5 text-muted-foreground hover:text-primary disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === steps.length - 1}
                      onClick={() => moveStep(idx, "down")}
                      className="p-1.5 text-muted-foreground hover:text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(idx)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Step Title</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                    placeholder="e.g. Discovery call: understand your needs and goals"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(idx, "description", e.target.value)}
                    placeholder="Describe this step..."
                    rows={2}
                    required
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
