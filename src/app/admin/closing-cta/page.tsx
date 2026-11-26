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
import { saveClosingCtaAction } from "@/actions/cms";
import { Loader2, ExternalLink, Save, Megaphone } from "lucide-react";

export default function ClosingCtaAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [heading, setHeading] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [buttonText, setButtonText] = React.useState("");
  const [buttonUrl, setButtonUrl] = React.useState("");
  const [statusBadgeText, setStatusBadgeText] = React.useState("");
  const [showStatusBadge, setShowStatusBadge] = React.useState(true);
  const [isPublished, setIsPublished] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/closing-cta");
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setHeading(d.heading || "");
          setDescription(d.description || "");
          setButtonText(d.buttonText || "");
          setButtonUrl(d.buttonUrl || "");
          setStatusBadgeText(d.statusBadgeText || "");
          setShowStatusBadge(d.showStatusBadge !== false);
          setIsPublished(d.isPublished !== false);
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to load Closing CTA",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveClosingCtaAction({
        heading,
        description,
        buttonText,
        buttonUrl,
        statusBadgeText,
        showStatusBadge,
        isPublished,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "Closing CTA Saved",
        description: "Public call-to-action band has been revalidated.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to save Closing CTA.",
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
            <Megaphone className="w-6 h-6 text-primary" />
            Closing CTA Band
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conversion call-to-action banner displayed above testimonials before the footer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/#cta" target="_blank">
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
                <CardTitle className="text-lg">Banner Copy & Status</CardTitle>
                <CardDescription>Primary heading and status badge</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="cta-published" className="text-xs text-muted-foreground">
                  {isPublished ? "Published" : "Draft / Hidden"}
                </Label>
                <Switch
                  id="cta-published"
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/60">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Availability Status Badge</Label>
                <p className="text-xs text-muted-foreground">e.g. &quot;Taking on new projects&quot;</p>
              </div>
              <Switch
                checked={showStatusBadge}
                onCheckedChange={(c) => {
                  setShowStatusBadge(c);
                  setHasUnsavedChanges(true);
                }}
              />
            </div>

            {showStatusBadge && (
              <div className="space-y-2">
                <Label htmlFor="badge-text">Status Badge Text</Label>
                <Input
                  id="badge-text"
                  value={statusBadgeText}
                  onChange={(e) => {
                    setStatusBadgeText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Taking on new projects"
                  required={showStatusBadge}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cta-heading">Headline</Label>
              <Input
                id="cta-heading"
                value={heading}
                onChange={(e) => {
                  setHeading(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Let's Build Something Exceptional Together"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta-desc">Subline / Description</Label>
              <Textarea
                id="cta-desc"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Need a custom web or mobile system built cleanly from start to finish?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Call to Action Button</CardTitle>
            <CardDescription>Target destination for the conversion button</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta-btn-text">Button Text</Label>
                <Input
                  id="cta-btn-text"
                  value={buttonText}
                  onChange={(e) => {
                    setButtonText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Discuss your project"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-btn-url">Button URL</Label>
                <Input
                  id="cta-btn-url"
                  value={buttonUrl}
                  onChange={(e) => {
                    setButtonUrl(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="/contact"
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
