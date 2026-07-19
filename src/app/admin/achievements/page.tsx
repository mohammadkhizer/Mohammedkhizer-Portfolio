"use client";

import * as React from "react";
import { useApiCollection } from "@/hooks/use-api-collection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Calendar, Pencil, X, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export default function AchievementsManagement() {
  const { toast } = useToast();
  const { data: achievements, isLoading, add, update, remove } = useApiCollection<Achievement>("/api/v1/achievements");
  const [title, setTitle] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [date, setDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !date || !description) return;

    const achData = {
      title,
      issuer,
      date,
      description,
    };

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
    setTitle("");
    setIssuer("");
    setDate("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setTitle(ach.title);
    setIssuer(ach.issuer);
    setDate(ach.date);
    setDescription(ach.description);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast({ title: "Achievement Deleted" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to delete achievement." });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements &amp; Accolades</h1>
        <p className="text-muted-foreground">Document your career milestones, hackathons, awards, and educational honors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit border-primary/10">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Achievement" : "Add Achievement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title / Honor</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Hackathon Winner" />
              </div>
              <div className="space-y-2">
                <Label>Issuer / Organization</Label>
                <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} required placeholder="e.g. Osmania University / Coursera" />
              </div>
              <div className="space-y-2">
                <Label>Date (e.g. October 2024)</Label>
                <Input value={date} onChange={(e) => setDate(e.target.value)} required placeholder="e.g. October 2024" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe what you accomplished..." />
              </div>
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
                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background flex items-center justify-center text-primary-foreground" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary shrink-0" />
                          <h3 className="font-bold text-lg">{ach.title}</h3>
                        </div>
                        <p className="text-primary font-medium text-sm mt-1">{ach.issuer}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" /> {ach.date}
                        </div>
                        <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                          {ach.description}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(ach)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(ach.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground italic">
                No achievements listed yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
