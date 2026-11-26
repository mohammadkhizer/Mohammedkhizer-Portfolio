"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { 
  Sparkles,
  UserCircle,
  Layers,
  ListOrdered,
  Megaphone,
  Quote,
  FolderKanban,
  Sliders,
  ArrowRight,
  MessageSquare,
  Inbox,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CMS_MODULES = [
  { name: "Home Hero", desc: "Hero copy, CTA buttons, and proof stats", href: "/admin/home-hero", icon: Sparkles, preview: "/" },
  { name: "About Hero", desc: "Centered hero banner with orange accent", href: "/admin/about-hero", icon: UserCircle, preview: "/about" },
  { name: "Services", desc: "Offering cards, repeatable bullets & timelines", href: "/admin/services", icon: Layers, preview: "/#services" },
  { name: "How I Work", desc: "4-step client process and guarantee", href: "/admin/how-i-work", icon: ListOrdered, preview: "/#process" },
  { name: "Closing CTA", desc: "Final conversion banner before footer", href: "/admin/closing-cta", icon: Megaphone, preview: "/#cta" },
  { name: "Testimonials", desc: "Client quotes rendered last on Home", href: "/admin/testimonials", icon: Quote, preview: "/#testimonials" },
  { name: "Projects & Cases", desc: "Case studies with structured architecture", href: "/admin/projects", icon: FolderKanban, preview: "/projects" },
  { name: "Site Settings", desc: "SEO metadata, social links & contact info", href: "/admin/site-settings", icon: Sliders, preview: "/" },
];

export default function AdminDashboard() {
  const { data: contacts } = useApiCollection("/api/v1/contact");

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin CMS Console</h1>
          <p className="text-muted-foreground mt-1">Single-owner portfolio management and inquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-border">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4" />
              View Public Site
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Content Management Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CMS_MODULES.map((mod) => (
            <Card key={mod.name} className="glass border-border/70 hover:border-primary/50 transition-all group flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform">
                  <mod.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-semibold">{mod.name}</CardTitle>
                <CardDescription className="text-xs">{mod.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex items-center justify-between border-t border-border/40 mt-2 py-3 bg-secondary/5">
                <Link
                  href={mod.href}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href={mod.preview}
                  target="_blank"
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                >
                  Preview <ExternalLink className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="glass border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Contact Inquiries
                </CardTitle>
                <CardDescription>Direct enquiries submitted via the /contact page.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs">
                <Link href="/admin/contact">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contacts && contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.slice(0, 5).map((contact: any) => (
                  <div key={contact.id} className="p-3 rounded-lg border border-border/60 bg-secondary/10 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{contact.senderName}</p>
                        <span className="text-xs text-muted-foreground">({contact.senderEmail})</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{contact.message}</p>
                    </div>
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-mono text-primary shrink-0">
                      {new Date(contact.submissionDate || contact.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <div className="p-3 bg-secondary/50 rounded-full">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No inquiries yet</p>
                <p className="text-xs text-muted-foreground">Submitted contacts will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
