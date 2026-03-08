
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { 
  Code2, 
  FolderKanban, 
  Briefcase, 
  Award, 
  ArrowRight,
  MessageSquare,
  GraduationCap,
  PlusCircle,
  Inbox,
  Quote
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const firestore = useFirestore();

  const skillsRef = useMemoFirebase(() => collection(firestore, "skills"), [firestore]);
  const projectsRef = useMemoFirebase(() => collection(firestore, "projects"), [firestore]);
  const experienceRef = useMemoFirebase(() => collection(firestore, "experiences"), [firestore]);
  const educationRef = useMemoFirebase(() => collection(firestore, "educations"), [firestore]);
  const certsRef = useMemoFirebase(() => collection(firestore, "certifications"), [firestore]);
  const contactRef = useMemoFirebase(() => collection(firestore, "contactSubmissions"), [firestore]);
  const testimonialsRef = useMemoFirebase(() => collection(firestore, "testimonials"), [firestore]);

  const { data: skills } = useCollection(skillsRef);
  const { data: projects } = useCollection(projectsRef);
  const { data: experiences } = useCollection(experienceRef);
  const { data: education } = useCollection(educationRef);
  const { data: certs } = useCollection(certsRef);
  const { data: contacts } = useCollection(contactRef);
  const { data: testimonials } = useCollection(testimonialsRef);

  const stats = [
    { name: "Skills", count: skills?.length || 0, icon: Code2, color: "text-blue-500", href: "/admin/skills" },
    { name: "Projects", count: projects?.length || 0, icon: FolderKanban, color: "text-green-500", href: "/admin/projects" },
    { name: "Experience", count: experiences?.length || 0, icon: Briefcase, color: "text-orange-500", href: "/admin/experience" },
    { name: "Education", count: education?.length || 0, icon: GraduationCap, color: "text-pink-500", href: "/admin/education" },
    { name: "Certifications", count: certs?.length || 0, icon: Award, color: "text-purple-500", href: "/admin/certifications" },
    { name: "Testimonials", count: testimonials?.length || 0, icon: Quote, color: "text-indigo-500", href: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Manage your portfolio content and track submissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stat.count}</div>
              <Link 
                href={stat.href} 
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-3"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Contact Submissions
            </CardTitle>
            <CardDescription>Inquiries from your portfolio visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            {contacts && contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{contact.senderName}</p>
                        <p className="text-xs text-muted-foreground">{contact.senderEmail}</p>
                      </div>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-black text-primary uppercase">
                        {new Date(contact.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs mt-2 line-clamp-2 text-muted-foreground">{contact.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="p-3 bg-secondary rounded-full">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">No inquiries yet</p>
                  <p className="text-xs text-muted-foreground">Messages from your contact form will appear here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Commonly used management tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/admin/projects">
                <PlusCircle className="h-5 w-5 text-primary" />
                Add New Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/admin/testimonials">
                <PlusCircle className="h-5 w-5 text-primary" />
                Add New Testimonial
              </Link>
            </Button>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-4">
              <p className="text-sm font-bold">Pro Tip</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Regularly updating your project showcase and client feedback keeps your portfolio engaging for recruiters and collaborators.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
