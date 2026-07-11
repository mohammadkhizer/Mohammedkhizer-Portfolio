"use client";

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
  /** JSON-LD FAQPage schema is injected inline.
   *  Set to false if the parent page already injects its own schema. */
  includeSchema?: boolean;
}

/**
 * FAQSection — Reusable FAQ accordion with FAQPage JSON-LD schema.
 *
 * Why this matters for GEO/AIO:
 * - FAQPage schema is one of the most reliable triggers for Google AI Overviews
 * - Perplexity and ChatGPT extract Q&A pairs directly from page content
 * - Answer-first structure with clear questions makes content directly citable
 * - Each answer is self-contained — no need to read the rest of the page
 */
export function FAQSection({
  title = 'Frequently Asked Questions',
  items,
  includeSchema = true,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="py-16">
      {/* Inject FAQPage JSON-LD inline so it is co-located with the content */}
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center space-y-4 mb-10">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            {title}
          </h2>
          <div className="w-16 h-1.5 bg-primary rounded-full mx-auto" />
        </div>

        <div className="space-y-3" role="list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                role="listitem"
                className="border border-border/50 rounded-2xl overflow-hidden glass"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left font-semibold text-sm md:text-base hover:text-primary transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  {/* The question text — this is what AI systems extract as the "question" */}
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {/* The answer — rendered in DOM always for crawler visibility */}
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
