
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export function Certifications() {
  const firestore = useFirestore();
  const certsRef = useMemoFirebase(() => firestore ? collection(firestore, "certifications") : null, [firestore]);
  const { data: certs, isLoading } = useCollection(certsRef);

  return (
    <section id="certifications" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Professional <span className="text-primary">Certifications</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continuously expanding my knowledge base through verified professional certifications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : certs && certs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.map((cert) => (
              <Card key={cert.id} className="glass border-border/40 group hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
                    <Image
                      src={cert.imageUrl || `https://picsum.photos/seed/${cert.id}/400/300`}
                      alt={cert.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized={!!cert.imageUrl}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Award className="h-5 w-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">{cert.issuingBody}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{cert.name}</h3>
                    <div className="flex items-center justify-end text-muted-foreground pt-4 border-t border-border/50">
                      {cert.credentialUrl && cert.credentialUrl !== "#" ? (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-[10px] italic">Verified Badge</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            No certifications found in the database.
          </div>
        )}
      </div>
    </section>
  );
}
