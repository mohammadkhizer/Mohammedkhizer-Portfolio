
"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Quote, Pencil, X, User, Star, PlusCircle, Inbox } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function TestimonialsManagement() {
  const firestore = useFirestore();
  const [clientName, setClientName] = React.useState("");
  const [clientTitle, setClientTitle] = React.useState("");
  const [testimonialText, setTestimonialText] = React.useState("");
  const [rating, setRating] = React.useState("5");
  const [imageUrl, setImageUrl] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const testimonialsRef = useMemoFirebase(() => firestore ? collection(firestore, "testimonials") : null, [firestore]);
  const { data: testimonials, isLoading } = useCollection(testimonialsRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !testimonialText || !firestore || !testimonialsRef) return;

    const testimonialData = {
      clientName,
      clientTitle,
      testimonialText,
      rating: parseInt(rating),
      clientImageUrl: imageUrl || ""
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, "testimonials", editingId), testimonialData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(testimonialsRef, { ...testimonialData, id: crypto.randomUUID() });
    }

    resetForm();
  };

  const resetForm = () => {
    setClientName("");
    setClientTitle("");
    setTestimonialText("");
    setRating("5");
    setImageUrl("");
    setEditingId(null);
  };

  const handleEdit = (test: any) => {
    setEditingId(test.id);
    setClientName(test.clientName);
    setClientTitle(test.clientTitle);
    setTestimonialText(test.testimonialText);
    setRating(test.rating?.toString() || "5");
    setImageUrl(test.clientImageUrl || "");
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, "testimonials", id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testimonials Management</h1>
        <p className="text-muted-foreground">Manage client feedback and professional recommendations for your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card className="sticky top-24 border-primary/20 shadow-lg glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
                {editingId ? "Edit Testimonial" : "Add New Feedback"}
              </CardTitle>
              <CardDescription>Capture client insights and professional vouches.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Client Name</Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required placeholder="e.g. Jane Doe" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title / Company</Label>
                  <Input value={clientTitle} onChange={(e) => setClientTitle(e.target.value)} placeholder="e.g. CTO at TechCorp" className="bg-background/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avatar URL (Optional)</Label>
                    <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="bg-background/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Testimonial Text</Label>
                  <Textarea value={testimonialText} onChange={(e) => setTestimonialText(e.target.value)} required placeholder="What did they say about your work?" className="min-h-[120px] bg-background/50" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 font-bold uppercase tracking-wider text-xs h-11">
                    {editingId ? "Update Testimonial" : "Add Testimonial"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm} className="h-11">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold px-1">Your Vouch List</h2>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((test) => (
                <div key={test.id} className="p-5 rounded-2xl border bg-card hover:border-primary/40 transition-all group flex gap-5 items-start">
                  <Avatar className="h-14 w-14 shrink-0 border-2 border-primary/10">
                    {test.clientImageUrl && <AvatarImage src={test.clientImageUrl} />}
                    <AvatarFallback className="bg-primary/5 text-primary"><User /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h3 className="font-black text-sm uppercase truncate">{test.clientName}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{test.clientTitle}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(test.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(test)} className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full bg-secondary/30">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(test.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full bg-secondary/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs mt-4 text-muted-foreground italic line-clamp-3 leading-relaxed border-t border-border/50 pt-4">
                      "{test.testimonialText}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground italic font-medium">No testimonials recorded yet.</p>
              <Button variant="outline" size="sm" onClick={() => (document.querySelector('input') as HTMLInputElement)?.focus()} className="rounded-full gap-2">
                <PlusCircle className="h-4 w-4" /> Add Your First Vouch
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
