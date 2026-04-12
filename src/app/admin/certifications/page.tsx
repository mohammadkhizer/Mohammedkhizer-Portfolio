"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { manageCertification, deleteCertification } from "@/actions/certifications";
import { refreshCsrfToken } from "@/actions/contact";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Award, ExternalLink, Pencil, X, Inbox, PlusCircle } from "lucide-react";

export default function CertificationsManagement() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [name, setName] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    refreshCsrfToken().then(token => setCsrfToken(token));
  }, []);

  const certsRef = useMemoFirebase(() => firestore ? collection(firestore, "certifications") : null, [firestore]);
  const { data: certs, isLoading } = useCollection(certsRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuer) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('issuingBody', issuer);
    formData.append('credentialUrl', url);
    formData.append('imageUrl', imageUrl);
    if (csrfToken) formData.append('csrfToken', csrfToken);

    try {
      const result = await manageCertification(formData, editingId);

      if (result.success) {
        toast({
          title: editingId ? "Achievement Updated" : "Achievement Added",
          description: `"${name}" has been successfully saved.`,
        });
        resetForm();
        // Refresh token after successful mutation to prevent reuse if needed
        const newToken = await refreshCsrfToken();
        setCsrfToken(newToken);
      } else {
        toast({
          variant: "destructive",
          title: "Error Saving Achievement",
          description: result.error || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the server. Please check your internet connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIssuer("");
    setUrl("");
    setImageUrl("");
    setEditingId(null);
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuingBody);
    setUrl(cert.credentialUrl === "#" ? "" : cert.credentialUrl);
    setImageUrl(cert.imageUrl || "");
  };

  const handleDelete = async (id: string, certName: string) => {
    if (!confirm(`Are you sure you want to delete "${certName}"?`)) return;
    
    try {
      const result = await deleteCertification(id);
      if (result.success) {
        toast({
          title: "Achievement Removed",
          description: `The achievement "${certName}" has been deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error Deleting Achievement",
          description: result.error || "Failed to remove the record.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the server.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Professional Certifications</h1>
        <p className="text-muted-foreground">Manage your credentials and achievement badges securely.</p>
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
                <Input value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>Issuing Body</Label>
                <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} required placeholder="e.g. CDAC, IBM, Meta" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>Credential URL</Label>
                <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>Image URL (Badge/Certificate Image)</Label>
                <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." disabled={loading} />
              </div>
              <input type="hidden" name="csrfToken" value={csrfToken || ""} />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (editingId ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />)}
                  {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Achievement" : "Add Achievement")}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
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
                      <div className="flex items-center gap-3 text-primary mb-2">
                        {cert.imageUrl ? (
                          <div className="h-10 w-10 relative overflow-hidden rounded-lg border bg-background">
                            <img src={cert.imageUrl} alt="" className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <Award className="h-5 w-5" />
                        )}
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
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(cert.id, cert.name)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          disabled={loading}
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