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
  saveProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "@/actions/cms";
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  FolderKanban,
  Pencil,
  ArrowUp,
  ArrowDown,
  X,
  PlusCircle,
  Network,
} from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  tech?: string;
}

interface ArchArrow {
  from: string;
  to: string;
}

interface ProjectItem {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  projectImageUrl?: string;
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  skillIds?: string[];
  categorySlug?: string;
  status?: "Live" | "In development";
  overview?: string;
  problem?: string;
  whatIBuilt?: string;
  result?: string;
  architectureDiagram?: {
    title?: string;
    caption?: string;
    nodes: ArchNode[];
    arrows: ArchArrow[];
  } | null;
  order: number;
  isPublished: boolean;
}

export default function ProjectsAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [projects, setProjects] = React.useState<ProjectItem[]>([]);

  // Form modal state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [mongoId, setMongoId] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState("");
  const [idSlug, setIdSlug] = React.useState("");
  const [status, setStatus] = React.useState<"Live" | "In development">("Live");
  const [overview, setOverview] = React.useState("");
  const [problem, setProblem] = React.useState("");
  const [whatIBuilt, setWhatIBuilt] = React.useState("");
  const [result, setResult] = React.useState("");
  const [techStackStr, setTechStackStr] = React.useState("");
  const [liveUrl, setLiveUrl] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);

  // Structured diagram state
  const [diagramNodes, setDiagramNodes] = React.useState<ArchNode[]>([]);
  const [diagramArrows, setDiagramArrows] = React.useState<ArchArrow[]>([]);
  const [diagramCaption, setDiagramCaption] = React.useState("");

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = React.useState<ProjectItem | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms/projects");
      const json = await res.json();
      if (json.data) {
        setProjects(json.data);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to load projects",
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
    setMongoId(undefined);
    setTitle("");
    setIdSlug("");
    setStatus("Live");
    setOverview("");
    setProblem("");
    setWhatIBuilt("");
    setResult("");
    setTechStackStr("Next.js, TypeScript, Tailwind CSS");
    setLiveUrl("");
    setGithubUrl("");
    setImageUrl("");
    setIsPublished(true);
    setDiagramNodes([
      { id: "frontend", label: "Client Frontend", sublabel: "Next.js UI", tech: "Tailwind" },
      { id: "backend", label: "Server API", sublabel: "Next.js API", tech: "App Router" },
      { id: "database", label: "Data Store", sublabel: "Database", tech: "MongoDB" },
    ]);
    setDiagramArrows([
      { from: "frontend", to: "backend" },
      { from: "backend", to: "database" },
    ]);
    setDiagramCaption("High-level system data flow and architecture.");
    setIsEditing(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditId(p.id);
    setMongoId(p._id);
    setTitle(p.title);
    setIdSlug(p.id);
    setStatus(p.status || "Live");
    setOverview(p.overview || p.description || "");
    setProblem(p.problem || "");
    setWhatIBuilt(p.whatIBuilt || "");
    setResult(p.result || "");
    setTechStackStr((p.skillIds || []).join(", "));
    setLiveUrl(p.liveDemoUrl || "");
    setGithubUrl(p.githubRepoUrl || "");
    setImageUrl(p.projectImageUrl || "");
    setIsPublished(p.isPublished !== false);

    if (p.architectureDiagram?.nodes) {
      setDiagramNodes(p.architectureDiagram.nodes);
      setDiagramArrows(p.architectureDiagram.arrows || []);
      setDiagramCaption(p.architectureDiagram.caption || "");
    } else {
      setDiagramNodes([]);
      setDiagramArrows([]);
      setDiagramCaption("");
    }

    setIsEditing(true);
  };

  const addDiagramNode = () => {
    const nextId = `node-${diagramNodes.length + 1}`;
    setDiagramNodes((prev) => [
      ...prev,
      { id: nextId, label: "Component Name", sublabel: "Role", tech: "Stack" },
    ]);
  };

  const removeDiagramNode = (idx: number) => {
    const removedId = diagramNodes[idx]?.id;
    setDiagramNodes((prev) => prev.filter((_, i) => i !== idx));
    setDiagramArrows((prev) =>
      prev.filter((a) => a.from !== removedId && a.to !== removedId)
    );
  };

  const addDiagramArrow = () => {
    if (diagramNodes.length >= 2) {
      setDiagramArrows((prev) => [
        ...prev,
        { from: diagramNodes[0].id, to: diagramNodes[1].id },
      ]);
    }
  };

  const removeDiagramArrow = (idx: number) => {
    setDiagramArrows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = (
      idSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    ).trim();

    const techArray = techStackStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const architectureDiagram =
      diagramNodes.length > 0
        ? {
            title: `${title} Architecture`,
            caption: diagramCaption,
            nodes: diagramNodes,
            arrows: diagramArrows,
          }
        : null;

    try {
      await saveProjectAction({
        _id: mongoId,
        id: slug,
        title,
        overview,
        problem,
        whatIBuilt,
        result,
        skillIds: techArray,
        categorySlug: "web",
        status,
        liveDemoUrl: liveUrl,
        githubRepoUrl: githubUrl,
        projectImageUrl: imageUrl,
        architectureDiagram,
        order: editId
          ? (projects.find((p) => p.id === editId)?.order ?? 0)
          : projects.length,
        isPublished,
      });

      toast({
        title: editId ? "Project Updated" : "Project Created",
        description: `"${title}" has been saved successfully.`,
      });

      setIsEditing(false);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.message || "Failed to save project.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteProjectAction(deleteCandidate._id || deleteCandidate.id);
      toast({
        title: "Project Deleted",
        description: `"${deleteCandidate.title}" was removed.`,
      });
      setDeleteCandidate(null);
      await loadData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to remove project.",
      });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setProjects(reordered);
    try {
      const ids = reordered.map((p) => p._id || p.id);
      await reorderProjectsAction(ids);
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
            <FolderKanban className="w-6 h-6 text-primary" />
            Projects & Case Studies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your project portfolio, case study narratives, and structured architecture diagrams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/projects" target="_blank">
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
            Add Project
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border bg-card/40">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold">No projects found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first case study using the button above.
            </p>
          </div>
        ) : (
          projects.map((p, idx) => (
            <Card
              key={p._id || p.id || idx}
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
                      disabled={idx === projects.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 hover:text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{p.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono">
                        /{p.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {p.status || "Live"}
                      </span>
                      {!p.isPublished && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </div>
                    {p.overview && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{p.overview}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-2 text-xs">
                      {p.skillIds?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground border border-border"
                        >
                          {s}
                        </span>
                      ))}
                      {p.architectureDiagram?.nodes && p.architectureDiagram.nodes.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <Network className="w-3 h-3" />
                          Diagram ({p.architectureDiagram.nodes.length} nodes)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button variant="outline" size="sm" asChild className="gap-1 border-border/80">
                    <Link href={`/projects/${p.id}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(p)}
                    className="gap-1 border-border/80 hover:border-primary/50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCandidate(p)}
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
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass border-primary/30 shadow-2xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-lg">
                  {editId ? `Edit Project: ${title}` : "Add New Project"}
                </CardTitle>
                <CardDescription>
                  Case study narrative, measurable result, stack, and architecture diagram
                </CardDescription>
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
              <CardContent className="space-y-5 pt-5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/60">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Published Status</Label>
                    <p className="text-xs text-muted-foreground">Visible on portfolio and sitemap</p>
                  </div>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="proj-title">Project Title</Label>
                    <Input
                      id="proj-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Inventory & Billing System"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proj-status">Status</Label>
                    <select
                      id="proj-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="Live">Live</option>
                      <option value="In development">In development</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-slug">URL Slug / ID</Label>
                  <Input
                    id="proj-slug"
                    value={idSlug}
                    onChange={(e) => setIdSlug(e.target.value)}
                    placeholder="inventory-billing-system"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-overview">Overview / Short Description</Label>
                  <Textarea
                    id="proj-overview"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="High-level summary of the system and business context..."
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-problem">Problem Statement</Label>
                  <Textarea
                    id="proj-problem"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. Stock and sales were tracked manually across disconnected spreadsheets, causing stockouts and slow invoicing."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-built">What I Built</Label>
                  <Textarea
                    id="proj-built"
                    value={whatIBuilt}
                    onChange={(e) => setWhatIBuilt(e.target.value)}
                    placeholder="e.g. Built real-time inventory management, automated PDF invoice generation, barcode generation, and role-based access control."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-result">Measurable Result</Label>
                  <Textarea
                    id="proj-result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="e.g. Cut inventory discrepancy rate and reduced billing time from hours to minutes."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-tech">Tech Stack (comma-separated)</Label>
                  <Input
                    id="proj-tech"
                    value={techStackStr}
                    onChange={(e) => setTechStackStr(e.target.value)}
                    placeholder="Next.js, TypeScript, Tailwind CSS, MongoDB, Firebase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proj-live">Live Demo / Production URL</Label>
                    <Input
                      id="proj-live"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proj-github">GitHub Repository URL</Label>
                    <Input
                      id="proj-github"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <ImageUpload
                  label="Project Cover Image"
                  value={imageUrl}
                  onChange={setImageUrl}
                />

                {/* Structured Architecture Diagram Editor */}
                <Card className="border border-border/80 bg-secondary/10">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-semibold">
                          Structured Architecture Diagram
                        </CardTitle>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDiagramNode}
                        className="text-xs gap-1 border-primary/30"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-primary" />
                        Add Node
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Diagram Nodes</Label>
                      {diagramNodes.map((node, nIdx) => (
                        <div key={nIdx} className="grid grid-cols-4 gap-2 items-center">
                          <Input
                            placeholder="Node ID"
                            value={node.id}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDiagramNodes((prev) => {
                                const copy = [...prev];
                                copy[nIdx] = { ...copy[nIdx], id: val };
                                return copy;
                              });
                            }}
                            className="text-xs font-mono"
                          />
                          <Input
                            placeholder="Label"
                            value={node.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDiagramNodes((prev) => {
                                const copy = [...prev];
                                copy[nIdx] = { ...copy[nIdx], label: val };
                                return copy;
                              });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="Tech/Role"
                            value={node.tech || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDiagramNodes((prev) => {
                                const copy = [...prev];
                                copy[nIdx] = { ...copy[nIdx], tech: val };
                                return copy;
                              });
                            }}
                            className="text-xs"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiagramNode(nIdx)}
                            className="text-muted-foreground hover:text-destructive h-8 px-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Diagram Flow Arrows</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={addDiagramArrow}
                          className="text-xs text-primary"
                        >
                          Add Flow Arrow
                        </Button>
                      </div>
                      {diagramArrows.map((arrow, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <Input
                            placeholder="From Node ID"
                            value={arrow.from}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDiagramArrows((prev) => {
                                const copy = [...prev];
                                copy[aIdx] = { ...copy[aIdx], from: val };
                                return copy;
                              });
                            }}
                            className="text-xs font-mono"
                          />
                          <span className="text-xs text-muted-foreground">→</span>
                          <Input
                            placeholder="To Node ID"
                            value={arrow.to}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDiagramArrows((prev) => {
                                const copy = [...prev];
                                copy[aIdx] = { ...copy[aIdx], to: val };
                                return copy;
                              });
                            }}
                            className="text-xs font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiagramArrow(aIdx)}
                            className="text-muted-foreground hover:text-destructive h-8 px-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="diag-caption" className="text-xs">
                        Architecture Caption
                      </Label>
                      <Input
                        id="diag-caption"
                        placeholder="Short summary of the architectural design"
                        value={diagramCaption}
                        onChange={(e) => setDiagramCaption(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>
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
                  Save Project Case Study
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
            <h3 className="text-lg font-bold">Delete Project?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove &quot;{deleteCandidate.title}&quot;?
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
