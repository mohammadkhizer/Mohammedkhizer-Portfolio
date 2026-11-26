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
import {
  saveServiceAction,
  deleteServiceAction,
  reorderServicesAction,
} from "@/actions/cms";
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Pencil,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  PlusCircle,
} from "lucide-react";

interface ServiceItem {
  _id?: string;
  id: string;
  title: string;
  shortDescription?: string;
  bullets: string[];
  timeline: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
  featured?: boolean;
  isPublished: boolean;
}

export default function ServicesAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [services, setServices] = React.useState<ServiceItem[]>([]);

  // Form modal state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [bullets, setBullets] = React.useState<string[]>([""]);
  const [timeline, setTimeline] = React.useState("Typical timeline: {{TODO: weeks}} weeks");
  const [buttonText, setButtonText] = React.useState("Discuss your project");
  const [buttonUrl, setButtonUrl] = React.useState("/contact");
  const [featured, setFeatured] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = React.useState<ServiceItem | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms/services");
      const json = await res.json();
      if (json.data) {
        setServices(json.data);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to load services",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setShortDescription("");
    setBullets(["Feature bullet 1", "Feature bullet 2", "Feature bullet 3"]);
    setTimeline("Typical timeline: {{TODO: weeks}} weeks");
    setButtonText("Discuss your project");
    setButtonUrl("/contact");
    setFeatured(false);
    setIsPublished(true);
    setIsEditing(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditId(service._id || service.id);
    setTitle(service.title);
    setShortDescription(service.shortDescription || "");
    setBullets(service.bullets?.length ? service.bullets : [""]);
    setTimeline(service.timeline);
    setButtonText(service.buttonText);
    setButtonUrl(service.buttonUrl);
    setFeatured(!!service.featured);
    setIsPublished(service.isPublished !== false);
    setIsEditing(true);
  };

  const handleBulletChange = (idx: number, val: string) => {
    setBullets((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const addBullet = () => {
    setBullets((prev) => [...prev, ""]);
  };

  const removeBullet = (idx: number) => {
    setBullets((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveServiceAction({
        _id: editId || undefined,
        title,
        shortDescription,
        bullets: bullets.filter((b) => b.trim().length > 0),
        timeline,
        buttonText,
        buttonUrl,
        order: editId ? (services.find((s) => (s._id || s.id) === editId)?.order ?? 0) : services.length,
        featured,
        isPublished,
      });

      toast({
        title: editId ? "Service Updated" : "Service Created",
        description: `"${title}" has been saved and published to the site.`,
      });

      setIsEditing(false);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.message || "Failed to save service.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteServiceAction(deleteCandidate._id || deleteCandidate.id);
      toast({
        title: "Service Removed",
        description: `"${deleteCandidate.title}" was deleted.`,
      });
      setDeleteCandidate(null);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to remove service.",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const reordered = [...services];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setServices(reordered);
    try {
      const ids = reordered.map((s) => s._id || s.id);
      await reorderServicesAction(ids);
    } catch {
      toast({
        variant: "destructive",
        title: "Reorder Failed",
        description: "Failed to persist ordering to database.",
      });
      await loadData();
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
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Services Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage business offerings, repeatable bullet points, timelines, and ordering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/#services" target="_blank">
              <ExternalLink className="w-4 h-4" />
              Live Preview
            </Link>
          </Button>
          <Button
            onClick={openCreateModal}
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border bg-card/40">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold">No services found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add Service&quot; above to add your first offering.
            </p>
          </div>
        ) : (
          services.map((svc, idx) => (
            <Card
              key={svc._id || svc.id || idx}
              className="glass border-border/70 hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 mt-1 text-muted-foreground">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 hover:text-primary disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono">{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === services.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 hover:text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{svc.title}</h3>
                      {svc.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                          Featured
                        </span>
                      )}
                      {!svc.isPublished && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </div>
                    {svc.shortDescription && (
                      <p className="text-sm text-muted-foreground mt-1">{svc.shortDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border">
                        {svc.timeline}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border">
                        {svc.bullets?.length || 0} bullets
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border">
                        CTA: {svc.buttonText} → {svc.buttonUrl}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(svc)}
                    className="gap-1 border-border/80 hover:border-primary/50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCandidate(svc)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass border-primary/30 shadow-2xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-lg">
                  {editId ? "Edit Service" : "Add New Service"}
                </CardTitle>
                <CardDescription>Enter details and bullet points for this offering</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/60">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Published Status</Label>
                    <p className="text-xs text-muted-foreground">Visible on public portfolio</p>
                  </div>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="svc-title">Service Title</Label>
                  <Input
                    id="svc-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Inventory & Billing Systems"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="svc-desc">Short Summary</Label>
                  <Textarea
                    id="svc-desc"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief description of the service outcome..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Deliverable Bullets (3-4 items)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addBullet}
                      className="text-xs text-primary gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Bullet
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, e.target.value)}
                          placeholder={`Bullet point ${idx + 1}`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBullet(idx)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="svc-timeline">Typical Timeline</Label>
                    <Input
                      id="svc-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="Typical timeline: {{TODO: weeks}} weeks"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <Label htmlFor="svc-featured" className="text-sm">
                      Featured Card
                    </Label>
                    <Switch id="svc-featured" checked={featured} onCheckedChange={setFeatured} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="svc-btn-text">Button Label</Label>
                    <Input
                      id="svc-btn-text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Discuss your project"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="svc-btn-url">Button URL</Label>
                    <Input
                      id="svc-btn-url"
                      value={buttonUrl}
                      onChange={(e) => setButtonUrl(e.target.value)}
                      placeholder="/contact"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-border/60 bg-secondary/10">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Service
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md glass border-destructive/40 bg-card p-6 space-y-4">
            <h3 className="text-lg font-bold">Delete Service?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove &quot;{deleteCandidate.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
