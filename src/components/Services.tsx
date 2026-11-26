'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  Layers,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { isFilled } from '@/lib/content-guard';

export interface ServiceItemProp {
  id: string;
  title: string;
  shortDescription?: string;
  bullets: string[];
  timeline: string;
  buttonText?: string;
  buttonUrl?: string;
  featured?: boolean;
}

const STATIC_SERVICES: ServiceItemProp[] = [
  {
    id: 'inventory-billing',
    title: 'Inventory & Billing Systems',
    shortDescription: 'Replace spreadsheets and manual billing with one reliable system for your business.',
    bullets: [
      'Real-time stock tracking across items, categories, and variants',
      'Clean invoicing, order records, and payment tracking',
      'Sales and inventory reports in one place',
      'Admin dashboard for daily operations',
    ],
    timeline: '',
    featured: true,
  },
  {
    id: 'website-admin',
    title: 'Business Website + Admin Panel',
    shortDescription: 'A fast, responsive website paired with a private panel to manage everything yourself.',
    bullets: [
      'Fast, mobile-responsive site built to turn visitors into enquiries',
      'Admin panel to manage pages, content, products, and services',
      'Structured enquiry inbox so no customer lead is missed',
      'Responsive, fast-loading and secure by default',
    ],
    timeline: '',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    shortDescription: 'Android and iOS apps built for customer login, orders or bookings, and management.',
    bullets: [
      'Android & iOS app with smooth, responsive performance',
      'Secure user login, profiles, and saved activity',
      'Order placement or booking management with status updates',
      'Admin panel to manage users, listings, and requests',
    ],
    timeline: '',
  },
];

function getServiceIcon(index: number) {
  if (index === 0) return <Package className="h-6 w-6 text-primary" aria-hidden="true" />;
  if (index === 1) return <Layers className="h-6 w-6 text-accent" aria-hidden="true" />;
  return <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />;
}

export function Services({ initialData }: { initialData?: ServiceItemProp[] }) {
  const items = initialData && initialData.length > 0 ? initialData : STATIC_SERVICES;

  return (
    <section id="services" className="scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
            <Package className="h-3 w-3" aria-hidden="true" />
            Services
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            How I Can <span className="text-primary">Help You</span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 bg-primary rounded-full mx-auto" />
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto pt-2 font-medium">
            Custom-built systems tailored to your business operations. No generic templates.
          </p>
        </div>

        {/* 3 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {items.map((pkg, idx) => (
            <Card
              key={pkg.id || idx}
              className={`relative flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                pkg.featured
                  ? 'border-primary/50 shadow-primary/10 shadow-lg bg-card/80'
                  : 'border-border/50 hover:border-border bg-card/50'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    Most Requested
                  </span>
                </div>
              )}

              <CardHeader className="space-y-4 pt-8">
                <div className="p-3 bg-secondary/50 rounded-2xl w-fit border border-border/50">
                  {getServiceIcon(idx)}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">
                    {pkg.title}
                  </CardTitle>
                  {pkg.shortDescription && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {pkg.shortDescription}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 flex-1">
                {/* Bullets */}
                <ul className="space-y-3" role="list">
                  {pkg.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle2
                        className="h-4 w-4 text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Timeline — only shown when a real value is provided */}
                {isFilled(pkg.timeline) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <span className="font-medium">{pkg.timeline}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 pb-6">
                <Button
                  className={`w-full rounded-xl font-bold text-xs h-11 flex items-center justify-center gap-2 ${
                    pkg.featured
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border/50'
                  }`}
                  asChild
                >
                  <Link href={pkg.buttonUrl || '/contact'}>
                    {pkg.buttonText || 'Discuss your project'}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
