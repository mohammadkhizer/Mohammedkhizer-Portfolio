"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Trash2, 
  Plus, 
  Loader2,
  Code2,
  Pencil,
  X,
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SkillsManagement() {
  const firestore = useFirestore();
  const [nameInput, setNameInput] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [proficiency, setProficiency] = React.useState("Advanced");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const skillsRef = useMemoFirebase(() => collection(firestore, "skills"), [firestore]);
  const { data: skills, isLoading } = useCollection(skillsRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !category.trim()) return;

    // Split by comma and clean up whitespace
    const names = nameInput.split(",").map(n => n.trim()).filter(n => n !== "");

    if (editingId) {
      // In edit mode, we update the single document with the first name provided
      const skillData = {
        name: names[0],
        category,
        proficiency,
        iconName: "Code2"
      };
      updateDocumentNonBlocking(doc(firestore, "skills", editingId), skillData);
      setEditingId(null);
    } else {
      // In create mode, we can add multiple documents
      names.forEach(name => {
        const skillData = {
          name,
          category,
          proficiency,
          iconName: "Code2",
          id: crypto.randomUUID()
        };
        addDocumentNonBlocking(skillsRef, skillData);
      });
    }

    setNameInput("");
    setCategory("");
    setProficiency("Advanced");
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setNameInput(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency || "Advanced");
  };

  const handleCancel = () => {
    setEditingId(null);
    setNameInput("");
    setCategory("");
    setProficiency("Advanced");
  };

  const handleDelete = (id: string) => {
    const docRef = doc(firestore, "skills", id);
    deleteDocumentNonBlocking(docRef);
  };

  // Live preview of names being added
  const namePreview = React.useMemo(() => {
    return nameInput.split(",").map(n => n.trim()).filter(n => n !== "");
  }, [nameInput]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
          <p className="text-muted-foreground">Manage your expertise and technologies displayed on your portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24 border-primary/20 shadow-lg glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
                {editingId ? "Edit Skill Entry" : "Add Multiple Skills"}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Modify an existing technical skill entry." 
                  : "Enter skill names separated by commas to add multiple at once."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="skill-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {editingId ? "Skill Name" : "Skill Names (Comma Separated)"}
                  </Label>
                  <Input 
                    id="skill-name" 
                    placeholder={editingId ? "e.g. React.js" : "e.g. React.js, Next.js, TypeScript"} 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="border-primary/20 focus-visible:ring-primary bg-background/50"
                  />
                  {!editingId && namePreview.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <span className="text-[10px] text-primary/70 w-full mb-1 uppercase font-black tracking-tighter">Adding:</span>
                      {namePreview.map((n, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] py-0 bg-primary/10 text-primary border-none">{n}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                  <Input 
                    id="category" 
                    placeholder="e.g. Frontend, Backend, AI/ML" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="border-primary/20 focus-visible:ring-primary bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="proficiency" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Proficiency Level</Label>
                  <select 
                    id="proficiency"
                    className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                  >
                    <option value="Expert">Expert (100%)</option>
                    <option value="Advanced">Advanced (85%)</option>
                    <option value="Intermediate">Intermediate (70%)</option>
                    <option value="Basic">Basic (50%)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 shadow-lg shadow-primary/20 font-bold uppercase tracking-wider text-xs h-11">
                    {editingId ? "Update Skill" : `Add ${namePreview.length || ''} Skill(s)`}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancel} className="h-11">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Existing Expertise</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : skills && skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/40 transition-all group shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <Code2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{skill.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-0.5">{skill.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-bold border-primary/20 bg-secondary/30">{skill.proficiency}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(skill)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(skill.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center">
                  <Code2 className="h-12 w-12 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground italic font-medium">No technical skills recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
