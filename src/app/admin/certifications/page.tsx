"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Award, ExternalLink, Pencil, X, Inbox, PlusCircle } from "lucide-react";

export default function CertificationsManagement() {
  const firestore = useFirestore();
  const [name, setName] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const certsRef = useMemoFirebase(() => firestore ? collection(firestore, "certifications") : null, [firestore]);
  const { data: certs, isLoading } = useCollection(certsRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuer) return;

    const certData = {
      name,
      issuingBody: issuer,
      credentialUrl: url || "#",
      issueDate: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, "certifications", editingId), certData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(certsRef, { ...certData, id: crypto.randomUUID() });
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setIssuer("");
    setUrl("");
    setEditingId(null);
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuingBody);
    setUrl(cert.credentialUrl === "#" ? "" : cert.credentialUrl);
  };

  const handleDelete = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "certifications", id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Professional Certifications</h1>
        <p className="text-muted-foreground">Manage your credentials and achievement badges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Certificate" : "Add Certificate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Certificate Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Issuing Body</Label>
                <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} required placeholder="e.g. CDAC, IBM, Meta" />
              </div>
              <div className="space-y-2">
                <Label>Credential URL</Label>
                <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {editingId ? "Update Achievement" : "Add Achievement"}
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
            <CardTitle>Your Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : certs && certs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certs.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl border bg-secondary/5 group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Award className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{cert.issuingBody}</span>
                      </div>
                      <h3 className="font-bold text-sm leading-tight">{cert.name}</h3>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      {cert.credentialUrl !== "#" ? (
                        <a href={cert.credentialUrl} target="_blank" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> Verify
                        </a>
                      ) : <span className="text-[10px] text-muted-foreground italic">No link</span>}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(cert)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(cert.id)}
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
              <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Inbox className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">No Certifications Yet</p>
                  <p className="text-sm text-muted-foreground italic">Add your professional achievements here.</p>
                </div>
                <Button variant="outline" onClick={() => (document.querySelector('input') as HTMLInputElement)?.focus()} className="gap-2">
                  <PlusCircle className="h-4 w-4" /> Add Your First Badge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}