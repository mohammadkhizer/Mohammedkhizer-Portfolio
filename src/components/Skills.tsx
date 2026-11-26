
"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, Layout, Server, Sparkles, Terminal, Loader2 } from "lucide-react";


const ICON_MAP: Record<string, React.ReactNode> = {
  "Programming": <Code2 className="h-6 w-6 text-primary" />,
  "Web Development": <Layout className="h-6 w-6 text-accent" />,
  "Databases & Tools": <Database className="h-6 w-6 text-primary" />,
  "Systems": <Terminal className="h-6 w-6 text-accent" />,
  "Computer Science": <Server className="h-6 w-6 text-primary" />,
  "Specialization": <Sparkles className="h-6 w-6 text-accent" />,
};

const EXCLUDED_SKILLS = new Set(['pc building', 'raspberry pi']);

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: "Expert" | "Advanced" | "Intermediate" | "Basic";
}

export function Skills({ 
  isPreview = false, 
  initialData = [] 
}: { 
  isPreview?: boolean;
  initialData?: Skill[];
}) {
  const skills = initialData;
  const isLoading = false;


  const groupedSkills = React.useMemo(() => {
    if (!skills) return [];

    interface GroupData {
      title: string;
      icon: React.ReactNode;
      skills: string[];
    }

    const groups: Record<string, GroupData> = {};
    
    skills.forEach((skill) => {
      if (EXCLUDED_SKILLS.has(skill.name.trim().toLowerCase())) {
        return;
      }
      const category = skill.category || "General";
      if (!groups[category]) {
        groups[category] = {
          title: category,
          icon: ICON_MAP[category] || <Code2 className="h-6 w-6 text-primary" />,
          skills: [],
        };
      }
      groups[category].skills.push(skill.name);
    });

    return Object.values(groups).filter((group) => group.skills.length > 0);
  }, [skills]);

  return (
    <section id="skills" className={`${isPreview ? '' : 'py-24'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          {isPreview ? (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technical <span className="text-primary">Skills</span></h2>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Technical <span className="text-primary">Skills</span></h1>
          )}
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of my technical expertise spanning multiple programming paradigms and software engineering platforms. 
            This technology stack is designed to build high-performance user interfaces using <span className="font-semibold text-foreground">React</span> and <span className="font-semibold text-foreground">Next.js</span>, 
            scalable API backends with <span className="font-semibold text-foreground">Python</span>, <span className="font-semibold text-foreground">Django</span>, and <span className="font-semibold text-foreground">Node.js</span>, 
            and data storage solutions using <span className="font-semibold text-foreground">MongoDB</span> and SQL databases.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : groupedSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {groupedSkills.map((category, idx) => (
              <Card key={idx} className="glass border-border/40 overflow-hidden shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-5 md:p-6 pb-2">
                  <div className="p-2.5 md:p-3 bg-secondary rounded-xl">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-6 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/50 text-[10px] md:text-xs py-0.5 px-3 rounded-full font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            No technical skills found in the database.
          </div>
        )}
      </div>
    </section>
  );
}
