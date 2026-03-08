
"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, Layout, Server, Sparkles, Terminal, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Programming": <Code2 className="h-6 w-6 text-primary" />,
  "Web Development": <Layout className="h-6 w-6 text-accent" />,
  "Databases & Tools": <Database className="h-6 w-6 text-primary" />,
  "Systems": <Terminal className="h-6 w-6 text-accent" />,
  "Computer Science": <Server className="h-6 w-6 text-primary" />,
  "Specialization": <Sparkles className="h-6 w-6 text-accent" />,
};

const PROFICIENCY_MAP: Record<string, number> = {
  "Expert": 100,
  "Advanced": 85,
  "Intermediate": 70,
  "Basic": 50,
};

export function Skills({ isPreview = false }: { isPreview?: boolean }) {
  const firestore = useFirestore();
  const skillsRef = useMemoFirebase(() => collection(firestore, "skills"), [firestore]);
  const { data: skills, isLoading } = useCollection(skillsRef);

  const groupedSkills = React.useMemo(() => {
    if (!skills) return [];
    const groups: Record<string, any> = {};
    
    skills.forEach((skill) => {
      const category = skill.category || "General";
      if (!groups[category]) {
        groups[category] = {
          title: category,
          icon: ICON_MAP[category] || <Code2 className="h-6 w-6 text-primary" />,
          skills: [],
          proficiencyTotal: 0,
          count: 0,
        };
      }
      groups[category].skills.push(skill.name);
      groups[category].proficiencyTotal += PROFICIENCY_MAP[skill.proficiency] || 85;
      groups[category].count += 1;
    });

    return Object.values(groups).map((group: any) => ({
      ...group,
      proficiency: Math.round(group.proficiencyTotal / group.count),
    }));
  }, [skills]);

  return (
    <section id="skills" className={`${isPreview ? '' : 'py-24'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technical <span className="text-primary">Skills</span></h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise spanning multiple programming paradigms and platforms.
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
                <CardContent className="space-y-6 p-5 md:p-6 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/50 text-[10px] md:text-xs py-0.5 px-3 rounded-full font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                      <span>Group Proficiency</span>
                      <span className="text-primary">{category.proficiency}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        style={{ width: `${category.proficiency}%` }}
                      />
                    </div>
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
