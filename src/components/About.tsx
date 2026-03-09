"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User, Award, GraduationCap, MapPin } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function About({ isPreview = false }: { isPreview?: boolean }) {
  const profileImg = PlaceHolderImages.find(img => img.id === 'profile-pic');

  return (
    <section id="about" className={`${isPreview ? 'rounded-3xl overflow-hidden' : 'py-24'} bg-transparent py-0`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="relative w-full max-w-[320px] md:max-w-md flex-shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-40" />
            <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
              <Image
                src={profileImg?.imageUrl || "https://techaura26.netlify.app/Assets/khizer.jpeg"}
                alt="Mohammed Khizer Shaikh"
                width={600}
                height={600}
                priority={true}
                sizes="(max-width: 768px) 320px, 600px"
                className="w-full h-auto object-cover aspect-square"
                data-ai-hint={profileImg?.imageHint || "professional man"}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white md:hidden">
                <p className="font-bold text-lg">Mohammed Khizer Shaikh</p>
                <p className="text-xs opacity-80 uppercase tracking-widest font-semibold">Full Stack Developer</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 md:space-y-10 max-w-2xl text-center md:text-left">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
                <User className="h-3 w-3" aria-hidden="true" />
                Who I Am
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                About <span className="text-primary">Me</span>
              </h2>
              <div className="w-16 md:w-24 h-2 bg-primary rounded-full mx-auto md:mx-0" />
            </div>
            
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                I am a passionate <span className="text-foreground font-semibold underline decoration-primary/40 decoration-4 underline-offset-4">Full-Stack Web Developer</span> and AI/ML enthusiast. 
                Currently in my <span className="text-foreground font-medium">2nd Year of CSE at SVGU</span>, I specialize in building 
                highly performant, user-centric web applications that bridge the gap between complex algorithms and intuitive design.
              </p>
              
              <p className="hidden md:block">
                My technical journey is driven by a curiosity for emerging technologies and a commitment to 
                delivering clean, maintainable code. From engineering official event websites to developing 
                AI-powered assistants, I thrive on solving real-world challenges through technology.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4">
              <Card className="glass border border-border/40 shadow-none bg-secondary/5">
                <CardContent className="p-5 md:p-6 text-center md:text-left space-y-2">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto md:mx-0">
                    <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-primary">2nd</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Year CSE Student</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass border border-border/40 shadow-none bg-secondary/5">
                <CardContent className="p-5 md:p-6 text-center md:text-left space-y-2">
                  <div className="p-2 bg-accent/10 rounded-lg w-fit mx-auto md:mx-0">
                    <Award className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-accent">10+</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Certifications</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
               <div className="flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                 Ahmedabad, Gujarat
               </div>
               <div className="hidden sm:block text-border" aria-hidden="true">|</div>
               <div className="flex items-center gap-2">
                 <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                 Open for Opportunities
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
