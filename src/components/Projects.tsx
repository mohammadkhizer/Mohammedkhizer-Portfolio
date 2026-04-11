"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Projects({ isPreview = false }: { isPreview?: boolean }) {
  const firestore = useFirestore();
  const projectsRef = useMemoFirebase(() => firestore ? collection(firestore, "projects") : null, [firestore]);
  const { data: projects, isLoading } = useCollection(projectsRef);

  const displayProjects = isPreview ? projects?.slice(0, 3) : projects;
  const webAppPlaceholder = PlaceHolderImages.find(img => img.id === 'project-web-apps');

  return (
    <section id="projects" className={`${isPreview ? '' : 'py-24'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technical <span className="text-primary">Projects</span></h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto md:mx-0">
              Practical applications of my skills in web development, AI/ML, and hardware integration.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
          </div>
        ) : displayProjects && displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProjects.map((project) => (
              <Card key={project.id} className="glass border-border/40 overflow-hidden flex flex-col h-full shadow-lg">
                <div className="relative aspect-video overflow-hidden bg-secondary/20">
                  <Image
                    src={project.projectImageUrl || webAppPlaceholder?.imageUrl || "https://picsum.photos/seed/project/800/600"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={webAppPlaceholder?.imageHint || "app screenshot"}
                  />
                </div>
                <CardHeader className="p-5 md:p-6 pb-2">
                  <CardTitle className="text-xl font-bold line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-5 md:p-6 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillIds?.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-[9px] md:text-[10px] uppercase font-bold tracking-tighter py-0 px-2 h-5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-5 md:p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
                  <div className="flex gap-4">
                    {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10" asChild aria-label={`View live demo for ${project.title}`}>
                        <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" aria-hidden="true" /> Demo
                        </a>
                      </Button>
                    )}
                    {project.githubRepoUrl && project.githubRepoUrl !== '#' && (
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary" asChild aria-label={`View source code for ${project.title} on GitHub`}>
                        <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3" aria-hidden="true" /> Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            No technical projects found in the database.
          </div>
        )}
      </div>
    </section>
  );
}
