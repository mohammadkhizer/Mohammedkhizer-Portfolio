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
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialsAction,
} from "@/actions/cms";
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Quote,
  Pencil,
  ArrowUp,
  ArrowDown,
  X,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialItem {
  _id?: string;
  id: string;
  clientName: string;
  clientTitle?: string;
  role?: string;
  business?: string;
  testimonialText: string;
  clientImageUrl?: string;
  rating?: number;
  order: number;
  isPublished: boolean;
}

export default function TestimonialsAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [testimonials, setTestimonials] = React.useState<TestimonialItem[]>([]);

  // Form modal state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [clientName, setClientName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const [testimonialText, setTestimonialText] = React.useState("");
  const [clientImageUrl, setClientImageUrl] = React.useState("");
  const [rating, setRating] = React.useState("5");
  const [isPublished, setIsPublished] = React.useState(true);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = React.useState<TestimonialItem | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms/testimonials");
      const json = await res.json();
      if (json.data) {
        setTestimonials(json.data);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to load testimonials",
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
    setClientName("");
    setRole("");
    setBusiness("");
    setTestimonialText("");
    setClientImageUrl("");
    setRating("5");
    setIsPublished(true);
    setIsEditing(true);
  };

  const openEditModal = (t: TestimonialItem) => {
    setEditId(t._id || t.id);
    setClientName(t.clientName);
    setRole(t.role || "");
    setBusiness(t.business || "");
    setTestimonialText(t.testimonialText);
    setClientImageUrl(t.clientImageUrl || "");
    setRating(String(t.rating || 5));
    setIsPublished(t.isPublished !== false);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTestimonialAction({
        _id: editId || undefined,
        clientName,
        clientTitle: role && business ? `${role}, ${business}` : role || business,
        role,
        business,
        testimonialText,
        clientImageUrl,
        rating: parseInt(rating) || 5,
        order: editId
          ? (testimonials.find((t) => (t._id || t.id) === editId)?.order ?? 0)
          : testimonials.length,
        isPublished,
      });

      toast({
        title: editId ? "Testimonial Updated" : "Testimonial Added",
        description: `Feedback from "${clientName}" saved successfully.`,
      });

      setIsEditing(false);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.message || "Failed to save testimonial.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteTestimonialAction(deleteCandidate._id || deleteCandidate.id);
      toast({
        title: "Testimonial Removed",
        description: `Feedback from "${deleteCandidate.clientName}" was deleted.`,
      });
      setDeleteCandidate(null);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to remove testimonial.",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const reordered = [...testimonials];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setTestimonials(reordered);
    try {
      const ids = reordered.map((t) => t._id || t.id);
      await reorderTestimonialsAction(ids);
    } catch {
      toast({
        variant: "destructive",
        title: "Reorder Failed",
        description: "Failed to persist ordering.",
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
            <Quote className="w-6 h-6 text-primary" />
            Testimonials & Client Feedback
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rendered as the final conversion section before the footer on the home page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/#testimonials" target="_blank">
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
            Add Testimonial
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border bg-card/40">
            <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold">No testimonials found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first client quote using the button above.
            </p>
          </div>
        ) : (
          testimonials.map((t, idx) => (
            <Card
              key={t._id || t.id || idx}
              className="glass border-border/70 hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
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
                      disabled={idx === testimonials.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 hover:text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <Avatar className="w-12 h-12 border border-border shrink-0">
                    <AvatarImage src={t.clientImageUrl} alt={t.clientName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {t.clientName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{t.clientName}</h3>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      {!t.isPublished && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.role && t.business
                        ? `${t.role} • ${t.business}`
                        : t.role || t.business || t.clientTitle || "Client"}
                    </p>
                    <p className="text-sm text-foreground/90 italic pt-1 line-clamp-2">
                      &quot;{t.testimonialText}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(t)}
                    className="gap-1 border-border/80 hover:border-primary/50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCandidate(t)}
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
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto glass border-primary/30 shadow-2xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-lg">
                  {editId ? "Edit Testimonial" : "Add Testimonial"}
                </CardTitle>
                <CardDescription>Enter real feedback from clients you&apos;ve built for</CardDescription>
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
                    <p className="text-xs text-muted-foreground">Visible on portfolio home</p>
                  </div>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-role">Role / Position</Label>
                    <Input
                      id="client-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Operations Manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-business">Company / Business</Label>
                    <Input
                      id="client-business"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="e.g. Logistics Ltd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-rating">Rating (1 to 5 Stars)</Label>
                    <Input
                      id="client-rating"
                      type="number"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-quote">Quote / Feedback</Label>
                  <Textarea
                    id="client-quote"
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    placeholder="Enter the client feedback..."
                    rows={4}
                    required
                  />
                </div>

                <ImageUpload
                  label="Client Photo / Avatar"
                  value={clientImageUrl}
                  onChange={setClientImageUrl}
                />
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
                  Save Testimonial
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
            <h3 className="text-lg font-bold">Delete Testimonial?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove feedback from &quot;{deleteCandidate.clientName}&quot;?
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
