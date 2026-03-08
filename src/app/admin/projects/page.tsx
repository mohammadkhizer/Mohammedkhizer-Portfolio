"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Trash2, 
  Plus, 
  Loader2,
  ExternalLink,
  Github,
  Pencil,
  X,
  PlusCircle,
  Inbox
} from "lucide-react";

export default function ProjectsManagement() {
  const firestore = useFirestore();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [techStack, setTechStack] = React.useState("");
  const [demoUrl, setDemoUrl] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("https://picsum.photos/seed/project/800/600");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const projectsRef = useMemoFirebase(() => collection(firestore, "projects"), [firestore]);
  const { data: projects, isLoading } = useCollection(projectsRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const projectData = {
      title,
      description,
      projectImageUrl: imageUrl || "https://picsum.photos/seed/project/800/600",
      liveDemoUrl: demoUrl,
      githubRepoUrl: githubUrl,
      skillIds: techStack.split(",").map(s => s.trim())
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, "projects", editingId), projectData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(projectsRef, { ...projectData, id: crypto.randomUUID() });
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTechStack("");
    setDemoUrl("");
    setGithubUrl("");
    setImageUrl("https://picsum.photos/seed/project/800/600");
    setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTechStack(project.skillIds?.join(", ") || "");
    setDemoUrl(project.liveDemoUrl || "");
    setGithubUrl(project.githubRepoUrl || "");
    setImageUrl(project.projectImageUrl || "https://picsum.photos/seed/project/800/600");
  };

  const handleDelete = (id: string) => {
    const docRef = doc(firestore, "projects", id);
    deleteDocumentNonBlocking(docRef);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Showcase</h1>
        <p className="text-muted-foreground">Display your best work and technical achievements.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech">Tech Stack (comma separated)</Label>
                <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Next.js, React, Tailwind" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demo">Demo URL</Label>
                  <Input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editingId ? "Update Project" : "Create Project"}
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

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden flex flex-col">
                <div className="relative aspect-video bg-secondary/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={project.projectImageUrl || "https://picsum.photos/seed/project/800/600"} 
                    alt={project.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform" 
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" onClick={() => handleEdit(project)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <div className="flex flex-wrap gap-1">
                    {project.skillIds?.map((skill: string) => (
                      <span key={skill} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t flex gap-4 text-muted-foreground text-xs">
                  {project.liveDemoUrl && project.liveDemoUrl !== "#" && <a href={project.liveDemoUrl} target="_blank" className="hover:text-primary flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Demo</a>}
                  {project.githubRepoUrl && project.githubRepoUrl !== "#" && <a href={project.githubRepoUrl} target="_blank" className="hover:text-primary flex items-center gap-1"><Github className="h-3 w-3" /> GitHub</a>}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">No Projects Yet</p>
                <p className="text-sm text-muted-foreground italic">Your professional showcase is currently empty.</p>
              </div>
              <Button variant="outline" onClick={() => (document.getElementById('title') as HTMLInputElement)?.focus()} className="gap-2">
                <PlusCircle className="h-4 w-4" /> Add Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}