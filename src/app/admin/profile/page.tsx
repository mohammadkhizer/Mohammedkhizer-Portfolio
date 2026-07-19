"use client";

import * as React from "react";
import { useApiCollection } from "@/hooks/use-api-collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, Link as LinkIcon, BarChart2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileManagement() {
  const { toast } = useToast();
  const { data: profiles, isLoading, add, update } = useApiCollection("/api/v1/profile");
  const profile = profiles?.[0];

  const [fullName, setFullName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [cvUrl, setCvUrl] = React.useState("");
  const [professionalSummary, setProfessionalSummary] = React.useState("");
  const [introductionSummary, setIntroductionSummary] = React.useState("");
  const [studentYear, setStudentYear] = React.useState("");

  // Stats Counters state variables
  const [yearsOfExperience, setYearsOfExperience] = React.useState<number | string>("");
  const [projectsCount, setProjectsCount] = React.useState<number | string>("");
  const [certificationsCount, setCertificationsCount] = React.useState<number | string>("");
  const [skillsCount, setSkillsCount] = React.useState<number | string>("");

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setTagline(profile.tagline || "");
      setCvUrl(profile.cvDownloadUrl || "");
      setProfessionalSummary(profile.professionalSummary || "");
      setIntroductionSummary(profile.introductionSummary || "");
      setStudentYear(profile.studentYear || "3rd");
      setYearsOfExperience(profile.yearsOfExperience !== undefined ? profile.yearsOfExperience : 2);
      setProjectsCount(profile.projectsCount !== undefined ? profile.projectsCount : 10);
      setCertificationsCount(profile.certificationsCount !== undefined ? profile.certificationsCount : 8);
      setSkillsCount(profile.skillsCount !== undefined ? profile.skillsCount : 15);
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
      introductionSummary: introductionSummary || tagline,
      yearsOfExperience: Number(yearsOfExperience),
      projectsCount: Number(projectsCount),
      certificationsCount: Number(certificationsCount),
      skillsCount: Number(skillsCount),
      studentYear,
      updatedAt: new Date().toISOString()
    };

    try {
      if (profile?.id) {
        await update(profile.id, profileData);
      } else {
        await add({ ...profileData, id: "main-profile" });
      }
      toast({
        title: "Profile Updated",
        description: "Your public information and counters have been saved successfully.",
      });
    } catch {
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile &amp; About Settings</h1>
        <p className="text-muted-foreground">Manage your identity, professional summaries, and metric counters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Card 1: Core Identity */}
        <Card className="border-primary/20 glass shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="h-5 w-5 text-primary" />
              Core Identity
            </CardTitle>
            <CardDescription>Configure your name, professional tagline, and CV attachment links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mohammed Khizer Shaikh"
                  className="bg-background/50 border-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Professional Tagline</Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Full-Stack Web Developer &amp; AI/ML Enthusiast"
                  className="bg-background/50 border-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">CSE Student Year</Label>
                <Input
                  value={studentYear}
                  onChange={(e) => setStudentYear(e.target.value)}
                  placeholder="e.g. 3rd"
                  className="bg-background/50 border-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <LinkIcon className="h-3 w-3" />
                CV Download URL
              </Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  placeholder="https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf"
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
            </div>
          </CardContent>
        </Card>

        {/* Card 2: About Section Content */}
        <Card className="border-primary/20 glass shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="h-5 w-5 text-primary" />
              About Section Content
            </CardTitle>
            <CardDescription>Manage the summaries displayed inside the About page and section grids.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Introduction Summary (About Top Block)</Label>
              <Textarea
                value={introductionSummary}
                onChange={(e) => setIntroductionSummary(e.target.value)}
                placeholder="I am a passionate Full-Stack Web Developer and AI/ML enthusiast based in Ahmedabad..."
                className="min-h-[100px] bg-background/50 border-primary/20"
              />
              <p className="text-[10px] text-muted-foreground italic">If left blank, this will fall back to your tagline value.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Professional Summary (About Main Body)</Label>
              <Textarea
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                placeholder="My technical journey is driven by a curiosity for emerging technologies..."
                className="min-h-[140px] bg-background/50 border-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Metrics & Stats Counters */}
        <Card className="border-primary/20 glass shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BarChart2 className="h-5 w-5 text-primary" />
              Metrics &amp; Stats Counters
            </CardTitle>
            <CardDescription>These values dynamically update the counter stats grids on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Years Experience</Label>
              <Input
                type="number"
                min="0"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="bg-background/50 border-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Projects Built</Label>
              <Input
                type="number"
                min="0"
                value={projectsCount}
                onChange={(e) => setProjectsCount(e.target.value)}
                className="bg-background/50 border-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Certifications</Label>
              <Input
                type="number"
                min="0"
                value={certificationsCount}
                onChange={(e) => setCertificationsCount(e.target.value)}
                className="bg-background/50 border-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tech Stack Entities</Label>
              <Input
                type="number"
                min="0"
                value={skillsCount}
                onChange={(e) => setSkillsCount(e.target.value)}
                className="bg-background/50 border-primary/20"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button disabled={isSaving} className="w-full h-12 font-bold uppercase tracking-widest shadow-lg shadow-primary/20 text-base">
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          Save Profile Changes
        </Button>
      </form>
    </div>
  );
}
