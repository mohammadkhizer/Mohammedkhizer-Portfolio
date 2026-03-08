
"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Quote, Loader2, Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Testimonials({ isPreview = false }: { isPreview?: boolean }) {
  const firestore = useFirestore();
  const testimonialsRef = useMemoFirebase(() => collection(firestore, "testimonials"), [firestore]);
  const { data: testimonials, isLoading } = useCollection(testimonialsRef);

  const displayTestimonials = isPreview ? testimonials?.slice(0, 3) : testimonials;

  if (!isLoading && (!displayTestimonials || displayTestimonials.length === 0)) {
    return null;
  }

  return (
    <section id="testimonials" className={`${isPreview ? '' : 'py-24'} bg-transparent`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            <Quote className="h-3 w-3" />
            Testimonials
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Client <span className="text-primary">Feedback</span>
          </h2>
          <div className="w-16 md:w-24 h-2 bg-primary rounded-full mx-auto" />
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto pt-4 font-medium">
            Trusted by founders and tech leaders across the industry for delivering exceptional technical solutions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials?.map((testimonial) => (
              <Card key={testimonial.id} className="glass border border-border/40 shadow-none bg-secondary/5 relative overflow-hidden flex flex-col pt-12 pb-8">
                <div className="absolute -top-4 -left-2 text-primary/10 select-none">
                  <Quote className="h-24 w-24 fill-current rotate-180" />
                </div>
                
                <CardContent className="flex-grow flex flex-col space-y-8 relative z-10">
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium italic">
                    "{testimonial.testimonialText}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-border/40 mt-auto">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0 shadow-sm">
                      <AvatarImage src={testimonial.clientImageUrl} alt={testimonial.clientName} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-foreground uppercase tracking-tight truncate">
                        {testimonial.clientName}
                      </h4>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] truncate mt-1">
                        {testimonial.clientTitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
