"use client";

import * as React from "react";
import { Trophy, Calendar, Sparkles } from "lucide-react";

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export function Achievements({ 
  initialData = [] 
}: { 
  initialData?: AchievementItem[];
}) {
  return (
    <section id="achievements" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 animate-pulse">
            <Sparkles className="h-3 w-3" />
            Milestones &amp; Accolades
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Key <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Achievements</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            A selection of professional milestones, honors, and recognitions earned throughout my career.
          </p>
        </div>

        {initialData && initialData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialData.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-2xl border border-primary/10 bg-background/50 backdrop-blur-md p-6 md:p-8 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative Background Gradient Orb on Hover */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-300" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold bg-secondary px-2.5 py-1 rounded-full border border-border/50">
                      <Calendar className="h-3 w-3 text-primary" /> {item.date}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold leading-snug group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm font-bold text-accent">
                      {item.issuer}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-end relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary/80 group-hover:translate-x-1 transition-transform">
                    Verified Recognition →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-background/50 border border-dashed border-border rounded-2xl max-w-md mx-auto">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h4 className="font-bold text-lg mb-1">No Achievements Listed</h4>
            <p className="text-sm text-muted-foreground">Achievements will appear here once they are added via the admin dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}
