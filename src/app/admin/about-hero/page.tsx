"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveAboutHeroAction } from "@/actions/cms";
import { Loader2, Plus, Trash2, ExternalLink, Save, UserCircle } from "lucide-react";

export default function AboutHeroAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [pillText, setPillText] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [headlineHighlight, setHeadlineHighlight] = React.useState("");
  const [subline, setSubline] = React.useState("");
  const [chips, setChips] = React.useState<string[]>([]);
  const [primaryButtonText, setPrimaryButtonText] = React.useState("");
  const [primaryButtonUrl, setPrimaryButtonUrl] = React.useState("");
  const [secondaryButtonText, setSecondaryButtonText] = React.useState("");
  const [secondaryButtonUrl, setSecondaryButtonUrl] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/about-hero");
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setPillText(d.pillText || "");
          setHeadline(d.headline || "");
          setHeadlineHighlight(d.headlineHighlight || "");
          setSubline(d.subline || "");
          setChips(d.chips || []);
          setPrimaryButtonText(d.primaryButtonText || "");
          setPrimaryButtonUrl(d.primaryButtonUrl || "");
          setSecondaryButtonText(d.secondaryButtonText || "");
          setSecondaryButtonUrl(d.secondaryButtonUrl || "");
          setIsPublished(d.isPublished !== false);
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to load about hero",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleChipChange = (index: number, value: string) => {
    setHasUnsavedChanges(true);
    setChips((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addChip = () => {
    setHasUnsavedChanges(true);
    setChips((prev) => [...prev, "New Value Highlight"]);
  };

  const removeChip = (index: number) => {
    setHasUnsavedChanges(true);
    setChips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAboutHeroAction({
        pillText,
        headline,
        headlineHighlight,
        subline,
        chips,
        primaryButtonText,
        primaryButtonUrl,
        secondaryButtonText,
        secondaryButtonUrl,
        isPublished,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "About Hero Updated",
        description: "Public /about page has been revalidated.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to save About Hero.",
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
            <UserCircle className="w-6 h-6 text-primary" />
            About Page Hero Block
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top centered hero on /about with badge, headline with orange highlight, and credential chips.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/about" target="_blank">
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
                <CardTitle className="text-lg">Header & Typography</CardTitle>
                <CardDescription>Configure the pill badge and dual-colored headline</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="about-published" className="text-xs text-muted-foreground">
                  {isPublished ? "Published" : "Draft / Hidden"}
                </Label>
                <Switch
                  id="about-published"
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
              <Label htmlFor="pill">Top Pill Badge Text</Label>
              <Input
                id="pill"
                value={pillText}
                onChange={(e) => {
                  setPillText(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Mohammed Khizer Shaikh • Gujarat, India"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline (White / Regular Text)</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="I build systems that save businesses"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headlineHighlight" className="text-primary font-medium">
                  Headline Highlight (Orange Accent Part)
                </Label>
                <Input
                  id="headlineHighlight"
                  value={headlineHighlight}
                  onChange={(e) => {
                    setHeadlineHighlight(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="hours every week."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subline">Subline (Descriptive Paragraph)</Label>
              <Input
                id="subline"
                value={subline}
                onChange={(e) => {
                  setSubline(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Web and mobile apps for businesses across industries."
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Value Proposition Chips</CardTitle>
                <CardDescription>Pills displaying key strengths under the headline</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addChip} className="gap-1.5 border-primary/30">
                <Plus className="w-4 h-4 text-primary" />
                Add Chip
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {chips.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={chip}
                  onChange={(e) => handleChipChange(idx, e.target.value)}
                  placeholder="e.g. 30 days dedicated post-launch support"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChip(idx)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Action Buttons</CardTitle>
            <CardDescription>Primary and secondary button configuration for /about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryBtnText">Primary Button Label</Label>
                <Input
                  id="primaryBtnText"
                  value={primaryButtonText}
                  onChange={(e) => {
                    setPrimaryButtonText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Discuss your project"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryBtnUrl">Primary Button Target URL</Label>
                <Input
                  id="primaryBtnUrl"
                  value={primaryButtonUrl}
                  onChange={(e) => {
                    setPrimaryButtonUrl(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="/contact"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secBtnText">Secondary Button Label</Label>
                <Input
                  id="secBtnText"
                  value={secondaryButtonText}
                  onChange={(e) => {
                    setSecondaryButtonText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="See my work"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secBtnUrl">Secondary Button Target URL</Label>
                <Input
                  id="secBtnUrl"
                  value={secondaryButtonUrl}
                  onChange={(e) => {
                    setSecondaryButtonUrl(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="/projects"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
