"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, Link as LinkIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const profileRef = useMemoFirebase(() => firestore ? collection(firestore, "userProfiles") : null, [firestore]);
  const { data: profiles, isLoading } = useCollection(profileRef);
  const profile = profiles?.[0];

  const [fullName, setFullName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [cvUrl, setCvUrl] = React.useState("");
  const [professionalSummary, setProfessionalSummary] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setTagline(profile.tagline || "");
      setCvUrl(profile.cvDownloadUrl || "");
      setProfessionalSummary(profile.professionalSummary || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const profileData = {
      fullName,
      tagline,
      cvDownloadUrl: cvUrl,
      professionalSummary,
      introductionSummary: tagline, // Mirroring for compatibility
      updatedAt: new Date().toISOString()
    };

    try {
      if (profile?.id) {
        updateDocumentNonBlocking(doc(firestore, "userProfiles", profile.id), profileData);
      } else {
        setDocumentNonBlocking(doc(firestore, "userProfiles", "main-profile"), { ...profileData, id: "main-profile" }, { merge: true });
      }
      toast({
        title: "Profile Updated",
        description: "Your public information has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save profile changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your core identity and document links.</p>
      </div>

      <Card className="border-primary/20 glass shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Core Identity
          </CardTitle>
          <CardDescription>This information appears in your Hero and About sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="e.g. Mohammed Khizer Shaikh"
                  className="bg-background/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tagline</Label>
                <Input 
                  value={tagline} 
                  onChange={(e) => setTagline(e.target.value)} 
                  placeholder="e.g. Full-Stack Web Developer"
                  className="bg-background/50 border-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="h-3 w-3" />
                CV Download URL
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="url"
                  value={cvUrl} 
                  onChange={(e) => setCvUrl(e.target.value)} 
                  placeholder="https://drive.google.com/..."
                  className="bg-background/50 border-primary/20"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={() => cvUrl && window.open(cvUrl, '_blank')}
                  disabled={!cvUrl}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Tip: Host your PDF on Google Drive or Dropbox and paste the share link here.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Professional Summary</Label>
              <Textarea 
                value={professionalSummary} 
                onChange={(e) => setProfessionalSummary(e.target.value)} 
                placeholder="Briefly describe your expertise..."
                className="min-h-[120px] bg-background/50 border-primary/20"
              />
            </div>

            <Button disabled={isSaving} className="w-full h-12 font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
