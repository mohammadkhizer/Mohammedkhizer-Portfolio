"use client";

import * as React from "react";
import { useApiCollection } from "@/hooks/use-api-collection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Loader2,
  Calendar,
  Pencil,
  X,
  Trophy,
  ImageIcon,
  Images,
  Link2,
  ExternalLink,
} from "lucide-react";

interface AchievementLink {
  label: string;
  url: string;
}

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  images?: string[];
  links?: AchievementLink[];
}

export default function AchievementsManagement() {
  const { toast } = useToast();
  const {
    data: achievements,
    isLoading,
    add,
    update,
    remove,
  } = useApiCollection<Achievement>("/api/v1/achievements");

  // ── Form fields ────────────────────────────────────────────────────────────
  const [title, setTitle] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [date, setDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [imageInput, setImageInput] = React.useState("");
  const [links, setLinks] = React.useState<AchievementLink[]>([]);
  const [linkLabel, setLinkLabel] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // ── Image URL manager ──────────────────────────────────────────────────────

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    try { new URL(url); } catch {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid image URL starting with http(s)://" });
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleImageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddImage(); }
  };

  // ── Link manager ────────────────────────────────────────────────────────────

  const handleAddLink = () => {
    const label = linkLabel.trim();
    const url = linkUrl.trim();
    if (!label || !url) return;
    try { new URL(url); } catch {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid URL starting with http(s)://" });
      return;
    }
    setLinks((prev) => [...prev, { label, url }]);
    setLinkLabel("");
    setLinkUrl("");
  };

  const handleRemoveLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddLink(); }
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !date || !description) return;

    const finalImages = [...images];
    if (imageInput.trim()) {
      try { new URL(imageInput.trim()); finalImages.push(imageInput.trim()); } catch { /* ignore */ }
    }

    // Auto-commit pending link if both fields have values
    const finalLinks = [...links];
    if (linkLabel.trim() && linkUrl.trim()) {
      try { new URL(linkUrl.trim()); finalLinks.push({ label: linkLabel.trim(), url: linkUrl.trim() }); } catch { /* ignore */ }
    }

    const achData = { title, issuer, date, description, images: finalImages, links: finalLinks };

    try {
      if (editingId) {
        await update(editingId, achData);
        toast({ title: "Achievement Updated" });
        setEditingId(null);
      } else {
        await add({ ...achData, id: crypto.randomUUID() });
        toast({ title: "Achievement Added" });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to save achievement." });
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle(""); setIssuer(""); setDate(""); setDescription("");
    setImages([]); setImageInput("");
    setLinks([]); setLinkLabel(""); setLinkUrl("");
    setEditingId(null);
  };

  const handleEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setTitle(ach.title);
    setIssuer(ach.issuer);
    setDate(ach.date);
    setDescription(ach.description);
    setImages(ach.images ?? []);
    setImageInput("");
    setLinks(ach.links ?? []);
    setLinkLabel(""); setLinkUrl("");
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast({ title: "Achievement Deleted" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to delete achievement." });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements &amp; Accolades</h1>
        <p className="text-muted-foreground">
          Document your career milestones, hackathons, awards, and educational honors. Each achievement can include images and external links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Form Card ────────────────────────────────────────────────────── */}
        <Card className="lg:col-span-1 h-fit border-primary/10">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Achievement" : "Add Achievement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label>Title / Honor</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Hackathon Winner" />
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <Label>Issuer / Organization</Label>
                <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} required placeholder="e.g. Osmania University / Coursera" />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date (e.g. October 2024)</Label>
                <Input value={date} onChange={(e) => setDate(e.target.value)} required placeholder="e.g. October 2024" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe what you accomplished..." rows={4} />
              </div>

              {/* ── Image URL Manager ──────────────────────────────────────── */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1.5">
                  <Images className="h-3.5 w-3.5 text-primary" />
                  Images
                  <span className="text-xs font-normal text-muted-foreground">(optional — single or carousel)</span>
                </Label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={handleImageInputKeyDown} placeholder="https://example.com/image.jpg" className="pl-8 text-xs font-mono" />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={handleAddImage} className="shrink-0" title="Add image URL">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    {images.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 p-2">
                        <div className="relative h-10 w-14 shrink-0 rounded overflow-hidden bg-secondary border border-border/50">
                          <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" unoptimized />
                        </div>
                        <p className="flex-1 text-[10px] font-mono text-muted-foreground truncate">{url}</p>
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Remove image">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground text-right">
                      {images.length} image{images.length !== 1 ? "s" : ""} — {images.length === 1 ? " single image" : " carousel"}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Links Manager ──────────────────────────────────────────── */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-primary" />
                  Links
                  <span className="text-xs font-normal text-muted-foreground">(optional — certificate, GitHub, etc.)</span>
                </Label>

                {/* Label input */}
                <Input
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="Link label (e.g. View Certificate)"
                  className="text-sm"
                />
                {/* URL + Add row */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={handleLinkKeyDown}
                      placeholder="https://example.com"
                      className="pl-8 text-xs font-mono"
                    />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={handleAddLink} className="shrink-0" title="Add link">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Link list */}
                {links.length > 0 && (
                  <div className="space-y-1.5">
                    {links.map((lnk, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2">
                        <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{lnk.label}</p>
                          <p className="text-[10px] font-mono text-muted-foreground truncate">{lnk.url}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveLink(idx)} className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Remove link">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground text-right">{links.length} link{links.length !== 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editingId ? "Update Entry" : "Add Entry"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── List Card ──────────────────────────────────────────────────────── */}
        <Card className="lg:col-span-2 border-primary/10">
          <CardHeader>
            <CardTitle>Achievements Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="space-y-6">
                {achievements.map((ach) => (
                  <div key={ach.id} className="relative pl-8 border-l-2 border-primary/20 pb-6 group">
                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Trophy className="h-4 w-4 text-primary shrink-0" />
                          <h3 className="font-bold text-lg">{ach.title}</h3>
                          {ach.images && ach.images.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                              <ImageIcon className="h-3 w-3" />
                              {ach.images.length === 1 ? "1 image" : `${ach.images.length} images`}
                            </span>
                          )}
                          {ach.links && ach.links.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                              <Link2 className="h-3 w-3" />
                              {ach.links.length} link{ach.links.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <p className="text-primary font-medium text-sm mt-1">{ach.issuer}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" /> {ach.date}
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-sm mt-3 text-muted-foreground leading-relaxed">
                          {ach.description}
                        </pre>

                        {/* Links preview */}
                        {ach.links && ach.links.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {ach.links.map((lnk, i) => (
                              <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent/80 bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-full border border-accent/20 transition-colors">
                                <ExternalLink className="h-3 w-3" />{lnk.label}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Thumbnail strip */}
                        {ach.images && ach.images.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {ach.images.slice(0, 5).map((img, i) => (
                              <div key={i} className="relative h-12 w-16 rounded-md overflow-hidden border border-border/50 bg-secondary">
                                <Image src={img} alt="" fill className="object-cover" unoptimized />
                              </div>
                            ))}
                            {ach.images.length > 5 && (
                              <div className="h-12 w-16 rounded-md border border-border/50 bg-secondary/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                +{ach.images.length - 5}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(ach)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ach.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground italic">No achievements listed yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
