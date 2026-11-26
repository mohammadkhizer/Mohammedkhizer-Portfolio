'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import {
  PhoneCall,
  FileCheck,
  CalendarCheck,
  Rocket,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface HowIWorkStepProp {
  stepNumber: string;
  title: string;
  description: string;
  order?: number;
}

const STATIC_STEPS: HowIWorkStepProp[] = [
  {
    stepNumber: '01',
    title: 'Discovery call: understand your needs and goals',
    description: 'We review how your business operates today, where time is lost, and what the system needs to deliver.',
  },
  {
    stepNumber: '02',
    title: 'Scope and fixed quote within 48 hours',
    description: 'You receive a written breakdown of features, delivery milestones, and a clear fixed quote within 48 hours.',
  },
  {
    stepNumber: '03',
    title: 'Weekly build demos',
    description: 'Development moves in weekly iterations so you can test live progress and confirm every detail early.',
  },
  {
    stepNumber: '04',
    title: 'Launch and 30 days of support',
    description: 'Full production launch, walkthrough for your team, and 30 days of dedicated post-launch support.',
  },
];

function getStepIcon(index: number) {
  if (index === 0) return <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />;
  if (index === 1) return <FileCheck className="h-5 w-5 text-primary" aria-hidden="true" />;
  if (index === 2) return <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />;
  return <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />;
}

export function HowIWork({
  initialData,
}: {
  initialData?: {
    steps?: HowIWorkStepProp[];
    communicationLine?: string;
  };
}) {
  const steps = initialData?.steps && initialData.steps.length > 0 ? initialData.steps : STATIC_STEPS;
  const commLine =
    initialData?.communicationLine ||
    'One point of contact, WhatsApp/email updates, weekly demo call.';

  return (
    <section id="process" className="scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
            <CalendarCheck className="h-3 w-3" aria-hidden="true" />
            Process
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            How I <span className="text-primary">Work</span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 bg-primary rounded-full mx-auto" />
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto pt-2 font-medium">
            A straightforward 4-step process from first call to launch.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <Card
              key={step.stepNumber || idx}
              className="relative p-6 bg-card/50 border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-primary/10 rounded-xl w-fit border border-primary/20">
                    {getStepIcon(idx)}
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/30 font-mono">
                    {step.stepNumber}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Communication & Guarantee line */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/60 text-xs md:text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>{commLine}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
