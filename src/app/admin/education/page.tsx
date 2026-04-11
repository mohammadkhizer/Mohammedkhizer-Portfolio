"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, GraduationCap, Calendar, Pencil, X, MapPin } from "lucide-react";

export default function EducationManagement() {
  const firestore = useFirestore();
  const [degree, setDegree] = React.useState("");
  const [institution, setInstitution] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const educationRef = useMemoFirebase(() => firestore ? collection(firestore, "educations") : null, [firestore]);
  const { data: educations, isLoading } = useCollection(educationRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institution || !startDate) return;

    const eduData = {
      degree,
      institutionName: institution,
      location,
      startDate,
      endDate: endDate || "Present",
      description
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, "educations", editingId), eduData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(educationRef, { ...eduData, id: crypto.randomUUID() });
    }

    resetForm();
  };

  const resetForm = () => {
    setDegree("");
    setInstitution("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setDegree(edu.degree);
    setInstitution(edu.institutionName);
    setLocation(edu.location || "");
    setStartDate(edu.startDate);
    setEndDate(edu.endDate === "Present" ? "" : edu.endDate);
    setDescription(edu.description);
  };

  const handleDelete = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "educations", id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Education Background</h1>
        <p className="text-muted-foreground">Manage your academic qualifications and certifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Education" : "Add Education"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Degree / Course</Label>
                <Input value={degree} onChange={(e) => setDegree(e.target.value)} required placeholder="e.g. Bachelor of Engineering" />
              </div>
              <div className="space-y-2">
                <Label>Institution Name</Label>
                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} required placeholder="e.g. Stanford University" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. California, USA" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} required placeholder="e.g. 2021" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="e.g. 2025" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Briefly describe your focus..." />
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
            <CardTitle>Academic Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : educations && educations.length > 0 ? (
              <div className="space-y-6">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative pl-8 border-l-2 border-accent/20 pb-6 group">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-accent border-4 border-background" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{edu.degree}</h3>
                        <p className="text-primary font-medium text-sm">{edu.institutionName}</p>
                        <div className="flex flex-wrap gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {edu.startDate} - {edu.endDate}
                          </div>
                          {edu.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {edu.location}
                            </div>
                          )}
                        </div>
                        <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                          {edu.description}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(edu)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(edu.id)}
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
                No education history listed yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
