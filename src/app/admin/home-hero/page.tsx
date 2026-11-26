"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveHomeHeroAction } from "@/actions/cms";
import { Loader2, Plus, Trash2, ExternalLink, Save, Sparkles } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
}

export default function HomeHeroAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [tagline, setTagline] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [primaryButtonText, setPrimaryButtonText] = React.useState("");
  const [primaryButtonUrl, setPrimaryButtonUrl] = React.useState("");
  const [secondaryButtonText, setSecondaryButtonText] = React.useState("");
  const [secondaryButtonUrl, setSecondaryButtonUrl] = React.useState("");
  const [cvDownloadUrl, setCvDownloadUrl] = React.useState("");
  const [stats, setStats] = React.useState<StatItem[]>([]);
  const [isPublished, setIsPublished] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/home-hero");
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setTagline(d.tagline || "");
          setSubtitle(d.subtitle || "");
          setPrimaryButtonText(d.primaryButtonText || "");
          setPrimaryButtonUrl(d.primaryButtonUrl || "");
          setSecondaryButtonText(d.secondaryButtonText || "");
          setSecondaryButtonUrl(d.secondaryButtonUrl || "");
          setCvDownloadUrl(d.cvDownloadUrl || "");
          setStats(d.stats || []);
          setIsPublished(d.isPublished !== false);
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to load hero content",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleStatChange = (index: number, field: "label" | "value", value: string) => {
    setHasUnsavedChanges(true);
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addStat = () => {
    setHasUnsavedChanges(true);
    setStats((prev) => [...prev, { label: "Metric Label", value: "10+" }]);
  };

  const removeStat = (index: number) => {
    setHasUnsavedChanges(true);
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHomeHeroAction({
        tagline,
        subtitle,
        primaryButtonText,
        primaryButtonUrl,
        secondaryButtonText,
        secondaryButtonUrl,
        cvDownloadUrl,
        stats,
        isPublished,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "Home Hero Updated",
        description: "Public home page has been revalidated with updated content.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to save Home Hero.",
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
            <Sparkles className="w-6 h-6 text-primary" />
            Home Hero Section
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the primary hero area, value proposition, action buttons, and proof stats.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/" target="_blank">
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
                <CardTitle className="text-lg">Hero Copy & Status</CardTitle>
                <CardDescription>Primary headline, tag and visibility toggle</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="published-toggle" className="text-xs text-muted-foreground">
                  {isPublished ? "Published" : "Draft / Hidden"}
                </Label>
                <Switch
                  id="published-toggle"
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
              <Label htmlFor="tagline">Tagline (Pill / Small Header)</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => {
                  setTagline(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Welcome to my space"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle / Primary Role</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Full-Stack Web & Mobile Developer"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Call to Action Buttons</CardTitle>
            <CardDescription>Configure primary audit CTA, secondary project link, and CV download</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryBtnText">Primary Button Text</Label>
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
                <Label htmlFor="secBtnText">Secondary Button Text</Label>
                <Input
                  id="secBtnText"
                  value={secondaryButtonText}
                  onChange={(e) => {
                    setSecondaryButtonText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="View Projects"
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

            <div className="space-y-2">
              <Label htmlFor="cvUrl">CV / Resume File URL</Label>
              <Input
                id="cvUrl"
                value={cvDownloadUrl}
                onChange={(e) => {
                  setCvDownloadUrl(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="https://.../resume.pdf"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Stats & Proof Row</CardTitle>
                <CardDescription>Repeatable metric cards displayed underneath the hero</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStat} className="gap-1.5 border-primary/30">
                <Plus className="w-4 h-4 text-primary" />
                Add Stat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-secondary/10">
                <div className="w-1/3">
                  <Input
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    placeholder="Value (e.g. 30 Days)"
                    className="font-bold text-primary"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="Label (e.g. Post-launch Support)"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStat(idx)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
