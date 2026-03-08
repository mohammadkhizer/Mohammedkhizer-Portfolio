
"use client";

import * as React from "react";
import { Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export function Experience({ isPreview = false }: { isPreview?: boolean }) {
  const firestore = useFirestore();
  
  const experienceRef = useMemoFirebase(() => collection(firestore, "experiences"), [firestore]);
  const { data: experiences, isLoading: isExpLoading } = useCollection(experienceRef);

  const educationRef = useMemoFirebase(() => collection(firestore, "educations"), [firestore]);
  const { data: education, isLoading: isEduLoading } = useCollection(educationRef);

  const displayExperiences = isPreview ? experiences?.slice(0, 2) : experiences;
  const displayEducation = isPreview ? education?.slice(0, 2) : education;

  return (
    <section id="experience" className={`${isPreview ? '' : 'py-24'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Work Experience Column */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="p-2.5 md:p-3 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Work <span className="text-primary">Experience</span></h2>
            </div>
            
            <div className="space-y-8 md:space-y-10 border-l-2 border-primary/20 ml-5 md:ml-6 pl-8 md:pl-10 relative">
              {isExpLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : displayExperiences && displayExperiences.length > 0 ? (
                displayExperiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[41px] md:-left-[45px] top-1.5 w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full border-4 border-background shadow-sm" />
                    <div className="space-y-2">
                      <span className="text-[10px] md:text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold leading-tight">{exp.jobTitle}</h3>
                      <p className="text-accent text-sm md:text-base font-semibold">{exp.companyName}</p>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">{exp.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic text-sm">No work experience listed.</p>
              )}
            </div>
          </div>

          {/* Education History Column */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="p-2.5 md:p-3 bg-accent rounded-xl text-accent-foreground shadow-lg shadow-accent/20">
                <GraduationCap className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Education <span className="text-accent">History</span></h2>
            </div>
            
            <div className="space-y-8 md:space-y-10 border-l-2 border-accent/20 ml-5 md:ml-6 pl-8 md:pl-10 relative">
              {isEduLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : displayEducation && displayEducation.length > 0 ? (
                displayEducation.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute -left-[41px] md:-left-[45px] top-1.5 w-4 h-4 md:w-5 md:h-5 bg-accent rounded-full border-4 border-background shadow-sm" />
                    <div className="space-y-2">
                      <span className="text-[10px] md:text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                         {edu.startDate} - {edu.endDate || 'Present'}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold leading-tight">{edu.degree}</h3>
                      <p className="text-primary text-sm md:text-base font-semibold">{edu.institutionName}</p>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">{edu.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic text-sm">No education history listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
