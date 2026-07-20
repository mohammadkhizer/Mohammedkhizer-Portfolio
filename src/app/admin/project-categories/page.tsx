"use client";

import * as React from "react";
import { useApiCollection } from "@/hooks/use-api-collection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Tag, Pencil, X, PlusCircle, Inbox } from "lucide-react";

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export default function ProjectCategoriesManagement() {
  const { toast } = useToast();
  const { data: categories, isLoading, add, update, remove } = useApiCollection<ProjectCategory>(
    "/api/v1/project-categories"
  );

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [order, setOrder] = React.useState("0");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setIsSaving(true);

    const data: Omit<ProjectCategory, "id"> & { id?: string } = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      order: parseInt(order) || 0,
    };

    try {
      if (editingId) {
        await update(editingId, data);
        toast({ title: "Category Updated", description: `"${name}" has been updated.` });
        setEditingId(null);
      } else {
        await add({ ...data, id: crypto.randomUUID() });
        toast({ title: "Category Created", description: `"${name}" is now available as a filter.` });
      }
      resetForm();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save category.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cat: ProjectCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setOrder(String(cat.order));
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? Projects using this category will become uncategorised.`)) return;
    try {
      await remove(id);
      toast({ title: "Category Deleted", description: `"${catName}" has been removed.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to delete." });
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setOrder("0");
    setEditingId(null);
  };

  const sortedCategories = React.useMemo(
    () => [...(categories || [])].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [categories]
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Categories</h1>
        <p className="text-muted-foreground mt-1">
          Create category filters (e.g. Web, Mobile, AI) displayed on the public projects page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24 border-primary/20 shadow-lg glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
                {editingId ? "Edit Category" : "Add Category"}
              </CardTitle>
              <CardDescription>
                {editingId ? "Modify this filter category." : "Add a new domain to filter projects."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cat-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Display Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g. Web Development"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-slug" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Slug (URL key) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cat-slug"
                    placeholder="e.g. web"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                    className="border-primary/20 focus-visible:ring-primary font-mono text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Used internally to assign projects to this category.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Brief description of this category"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-order" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Display Order
                  </Label>
                  <Input
                    id="cat-order"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary w-24"
                  />
                  <p className="text-[10px] text-muted-foreground">Lower number = shown first in filter bar.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : editingId ? (
                      <Pencil className="h-4 w-4 mr-2" />
                    ) : (
                      <PlusCircle className="h-4 w-4 mr-2" />
                    )}
                    {editingId ? "Update Category" : "Add Category"}
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
        </div>

        {/* List */}
        <div className="lg:col-span-7 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
              <Inbox className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-semibold">No categories yet</p>
              <p className="text-sm opacity-70 mt-1">Create your first filter category using the form.</p>
            </div>
          ) : (
            sortedCategories.map((cat) => (
              <Card key={cat.id} className={`glass border-border/30 shadow transition-shadow hover:shadow-md ${editingId === cat.id ? "border-primary/40 ring-1 ring-primary/20" : ""}`}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{cat.name}</span>
                        <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-wider py-0 px-1.5 h-4">
                          /{cat.slug}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4">
                          order: {cat.order}
                        </Badge>
                      </div>
                      {cat.description && (
                        <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground mt-1 line-clamp-2">
                          {cat.description}
                        </pre>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => handleEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
