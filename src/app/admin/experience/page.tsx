"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Briefcase, Calendar, Pencil, X } from "lucide-react";

export default function ExperienceManagement() {
  const firestore = useFirestore();
  const [role, setRole] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [period, setPeriod] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const experienceRef = useMemoFirebase(() => collection(firestore, "experiences"), [firestore]);
  const { data: experiences, isLoading } = useCollection(experienceRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !company) return;

    const expData = {
      jobTitle: role,
      companyName: company,
      startDate: period.split("-")[0].trim(),
      endDate: period.split("-")[1]?.trim() || "Present",
      description,
      location: "Remote/Office"
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, "experiences", editingId), expData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(experienceRef, { ...expData, id: crypto.randomUUID() });
    }

    resetForm();
  };

  const resetForm = () => {
    setRole("");
    setCompany("");
    setPeriod("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setRole(exp.jobTitle);
    setCompany(exp.companyName);
    setPeriod(`${exp.startDate} - ${exp.endDate}`);
    setDescription(exp.description);
  };

  const handleDelete = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "experiences", id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
        <p className="text-muted-foreground">Document your professional journey and internships.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Experience" : "Add Experience"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Period (e.g. May 2024 - June 2024)</Label>
                <Input value={period} onChange={(e) => setPeriod(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timeline Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : experiences && experiences.length > 0 ? (
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-primary/20 pb-6 group">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                        <p className="text-primary font-medium text-sm">{exp.companyName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" /> {exp.startDate} - {exp.endDate}
                        </div>
                        <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(exp)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(exp.id)}
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
                No work experience listed yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}