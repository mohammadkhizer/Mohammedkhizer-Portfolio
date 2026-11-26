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

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Discovery call: understand your needs and goals',
    description: 'We review how your business operates today, where time is lost, and what the system needs to deliver.',
    icon: <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    number: '02',
    title: 'Scope and fixed quote within 48 hours',
    description: 'You receive a written breakdown of features, delivery milestones, and a clear fixed quote within 48 hours.',
    icon: <FileCheck className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    number: '03',
    title: 'Weekly build demos',
    description: 'Development moves in weekly iterations so you can test live progress and confirm every detail early.',
    icon: <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    number: '04',
    title: 'Launch and 30 days of support',
    description: 'Full production launch, walkthrough for your team, and 30 days of dedicated post-launch support.',
    icon: <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
];

export function HowIWork() {
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
          {STEPS.map((step) => (
            <Card
              key={step.number}
              className="glass border border-border/40 bg-secondary/5 relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary/30 font-mono">
                    {step.number}
                  </span>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {step.title}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Communication Commitment Line */}
        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-2xl bg-secondary/20 border border-border/50 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm md:text-base font-semibold text-foreground">
            <span className="inline-flex items-center gap-2 text-primary font-bold">
              <MessageSquare className="h-4 w-4" aria-hidden="true" /> Communication:
            </span>
            <span>One point of contact, WhatsApp/email updates, weekly demo call.</span>
          </div>
        </div>

        {/* Process CTA */}
        <div className="flex justify-center pt-10">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 gap-2"
          >
            <Link href="/contact">
              Discuss your project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
