"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, LayoutGrid, Layers } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export interface Project {
  id: string;
  title: string;
  description: string;
  projectImageUrl?: string;
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  skillIds?: string[];
  categorySlug?: string;
  createdAt?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export function Projects({
  isPreview = false,
  initialData = [],
  categories = [],
}: {
  isPreview?: boolean;
  initialData?: Project[];
  categories?: ProjectCategory[];
}) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const webAppPlaceholder = PlaceHolderImages.find((img) => img.id === "project-web-apps");

  // Sort categories by order
  const sortedCategories = React.useMemo(
    () => [...categories].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [categories]
  );

  // Filter projects by active category
  const filteredProjects = React.useMemo(() => {
    const base = isPreview ? initialData.slice(0, 3) : initialData;
    if (activeCategory === "all") return base;
    return base.filter((p) => p.categorySlug === activeCategory);
  }, [initialData, activeCategory, isPreview]);

  // Only show filter bar when there are categories AND we're not in preview mode
  const showFilters = !isPreview && sortedCategories.length > 0;

  return (
    <section id="projects" className={`${isPreview ? "" : "py-24"}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-3 md:space-y-4 text-center md:text-left w-full">
            {isPreview ? (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Technical <span className="text-primary">Projects</span>
              </h2>
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Technical <span className="text-primary">Projects</span>
              </h1>
            )}
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Practical engineering solutions applying full-stack web development, Artificial Intelligence, machine
              learning integrations, and backend architectures. Each project is structured to document the specific
              technical problem, system architecture, selected tech stack, and key performance results.
            </p>
          </div>
        </div>

        {/* Category Filter Bar */}
        {showFilters && (
          <div
            className="flex flex-wrap gap-2 mb-10 md:mb-12"
            role="group"
            aria-label="Filter projects by category"
          >
            {/* "All" button */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5"
              }`}
              aria-pressed={activeCategory === "all"}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              All
              <span
                className={`ml-1 rounded-full px-1.5 py-0 text-[10px] ${
                  activeCategory === "all"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {initialData.length}
              </span>
            </button>

            {/* Category buttons */}
            {sortedCategories.map((cat) => {
              const count = initialData.filter((p) => p.categorySlug === cat.slug).length;
              if (count === 0) return null;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  }`}
                  aria-pressed={isActive}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  {cat.name}
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0 text-[10px] ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="glass border-border/40 overflow-hidden flex flex-col h-full shadow-lg group hover:shadow-primary/10 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-secondary/20">
                  <Image
                    src={
                      project.projectImageUrl ||
                      webAppPlaceholder?.imageUrl ||
                      "https://picsum.photos/seed/project/800/600"
                    }
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint={webAppPlaceholder?.imageHint || "app screenshot"}
                  />
                  {/* Category badge overlay */}
                  {project.categorySlug && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-primary border border-primary/20">
                        {sortedCategories.find((c) => c.slug === project.categorySlug)?.name ||
                          project.categorySlug}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Header */}
                <CardHeader className="p-5 md:p-6 pb-2">
                  <CardTitle className="text-xl font-bold line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                {/* Tech Stack Badges */}
                <CardContent className="flex-grow p-5 md:p-6 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillIds?.map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-[9px] md:text-[10px] uppercase font-bold tracking-tighter py-0 px-2 h-5"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                {/* Footer Links */}
                <CardFooter className="p-5 md:p-6 pb-4 pt-4 flex flex-row items-center justify-between border-t border-border/10 mt-auto bg-card rounded-b-xl">
                  <div className="flex gap-1.5">
                    {project.liveDemoUrl && project.liveDemoUrl !== "#" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                        asChild
                        aria-label={`View live demo for ${project.title}`}
                      >
                        <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                    {project.githubRepoUrl && project.githubRepoUrl !== "#" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        asChild
                        aria-label={`View source for ${project.title} on GitHub`}
                      >
                        <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            {activeCategory !== "all" ? (
              <div className="space-y-3">
                <p className="italic">No projects found in this category.</p>
                <button
                  onClick={() => setActiveCategory("all")}
                  className="text-primary text-sm underline underline-offset-4 hover:no-underline"
                >
                  View all projects
                </button>
              </div>
            ) : (
              <p className="italic">No technical projects found in the database.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
