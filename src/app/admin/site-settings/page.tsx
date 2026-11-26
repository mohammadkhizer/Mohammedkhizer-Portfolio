"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveSiteSettingsAction } from "@/actions/cms";
import { Loader2, ExternalLink, Save, Sliders, Globe } from "lucide-react";

export default function SiteSettingsAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [footerBio, setFooterBio] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [github, setGithub] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [twitter, setTwitter] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/site-settings");
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setMetaTitle(d.metaTitle || "");
          setMetaDescription(d.metaDescription || "");
          setFooterBio(d.footerBio || "");
          setContactEmail(d.contactEmail || "");
          setContactPhone(d.contactPhone || "");
          setGithub(d.socialLinks?.github || "");
          setLinkedin(d.socialLinks?.linkedin || "");
          setInstagram(d.socialLinks?.instagram || "");
          setTwitter(d.socialLinks?.twitter || "");
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettingsAction({
        metaTitle,
        metaDescription,
        footerBio,
        contactEmail,
        contactPhone,
        socialLinks: {
          github,
          linkedin,
          instagram,
          twitter,
        },
        isPublished: true,
      });

      setHasUnsavedChanges(false);
      toast({
        title: "Site Settings Saved",
        description: "Global site metadata, footer, and social links updated.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Failed to save site settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-primary" />
            Site Settings & Global Metadata
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure SEO metadata, footer copy, contact information, and public social profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4" />
              Live Preview
            </Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs flex items-center justify-between">
          <span>You have unsaved changes in this form.</span>
          <span className="font-semibold underline cursor-pointer" onClick={handleSubmit}>
            Save now
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">SEO & Meta Configuration</CardTitle>
            </div>
            <CardDescription>Default title and description indexed by search crawlers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Default Meta Title</Label>
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(e) => {
                  setMetaTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-desc">Default Meta Description</Label>
              <Textarea
                id="meta-desc"
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Full-Stack Web & Mobile Developer building web and mobile systems for businesses."
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information & Footer Bio</CardTitle>
            <CardDescription>Contact email and brief footer summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="work.mkhizer@gmail.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone / WhatsApp</Label>
                <Input
                  id="contact-phone"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="+91 9510865651"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer-bio">Footer Summary</Label>
              <Textarea
                id="footer-bio"
                value={footerBio}
                onChange={(e) => {
                  setFooterBio(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Full-Stack Web & Mobile Developer building web and mobile systems for businesses."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Social Profiles</CardTitle>
            <CardDescription>Links shown in navbar, footer, and contact section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soc-gh">GitHub Profile URL</Label>
                <Input
                  id="soc-gh"
                  value={github}
                  onChange={(e) => {
                    setGithub(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soc-in">LinkedIn Profile URL</Label>
                <Input
                  id="soc-in"
                  value={linkedin}
                  onChange={(e) => {
                    setLinkedin(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soc-ig">Instagram URL</Label>
                <Input
                  id="soc-ig"
                  value={instagram}
                  onChange={(e) => {
                    setInstagram(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soc-tw">Twitter / X URL</Label>
                <Input
                  id="soc-tw"
                  value={twitter}
                  onChange={(e) => {
                    setTwitter(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="https://x.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
