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

interface ServicePackage {
  id: string;
  title: string;
  icon: React.ReactNode;
  tagline: string;
  bullets: string[];
  timeline: string;
  featured?: boolean;
}

const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'inventory-billing',
    title: 'Inventory & Billing Systems',
    icon: <Package className="h-6 w-6 text-primary" aria-hidden="true" />,
    tagline: 'Replace spreadsheets and manual billing with one reliable system for your business.',
    bullets: [
      'Real-time stock tracking across items, categories, and variants',
      'Clean invoicing, order records, and payment tracking',
      'Sales and inventory reports in one place',
      'Role-based admin dashboard for daily operations',
    ],
    // {{TODO: Replace with your typical delivery range in weeks for Inventory & Billing Systems}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
    featured: true,
  },
  {
    id: 'website-admin',
    title: 'Business Website + Admin Panel',
    icon: <Layers className="h-6 w-6 text-accent" aria-hidden="true" />,
    tagline: 'A fast, responsive website paired with a private panel to manage everything yourself.',
    bullets: [
      'Fast, mobile-responsive site built to turn visitors into enquiries',
      'Admin panel to manage pages, content, products, and services',
      'Structured enquiry inbox so no customer lead is missed',
      'Search-friendly structure, performance tuning, and SSL setup',
    ],
    // {{TODO: Replace with your typical delivery range in weeks for Business Website + Admin Panel}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    icon: <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />,
    tagline: 'Android and iOS apps built for customer login, orders or bookings, and management.',
    bullets: [
      'Android & iOS app with smooth, responsive performance',
      'Secure user login, profiles, and saved activity',
      'Order placement or booking management with status updates',
      'Admin panel to manage users, listings, and requests',
    ],
    // {{TODO: Replace with your typical delivery range in weeks for Mobile App Development}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
  },
];

export function Services() {
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
            What I <span className="text-primary">Build</span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 bg-primary rounded-full mx-auto" />
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto pt-2 font-medium">
            Custom web and mobile systems built for businesses across domains—with clear scope, predictable delivery, and dedicated post-launch support.
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {SERVICE_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`glass flex flex-col justify-between transition-all duration-300 relative overflow-hidden rounded-3xl ${
                pkg.featured
                  ? 'border-2 border-primary/50 bg-primary/[0.02] shadow-2xl shadow-primary/10 lg:-translate-y-2'
                  : 'border border-border/40 bg-secondary/5 hover:border-primary/30'
              }`}
            >
              {pkg.featured && (
                <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider py-1 px-4 text-center">
                  Most Requested
                </div>
              )}

              <div>
                <CardHeader className="p-6 md:p-8 pb-4 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary border border-primary/20">
                    {pkg.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black tracking-tight">
                      {pkg.title}
                    </CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {pkg.tagline}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 pt-2 space-y-6">
                  {/* Timeline Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 text-foreground text-xs font-semibold border border-border/50">
                    <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{pkg.timeline}</span>
                  </div>

                  {/* Bullet Inclusions */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-6 md:p-8 pt-0 mt-4">
                <Button
                  asChild
                  className={`w-full py-6 rounded-2xl font-bold text-sm shadow-md transition-all gap-2 group ${
                    pkg.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                      : 'bg-secondary text-foreground hover:bg-primary hover:text-white'
                  }`}
                >
                  <Link href="/contact">
                    Discuss your project
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
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
