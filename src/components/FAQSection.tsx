"use client";

import * as React from 'react';
import { ChevronDown, Search, ChevronsUpDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
 * FAQSection — Enhanced Expandable FAQ accordion with inline search, expand all controls, and FAQPage JSON-LD schema.
 */
export function FAQSection({
  title = 'Frequently Asked Questions',
  items,
  includeSchema = true,
}: FAQSectionProps) {
  const [openIndices, setOpenIndices] = React.useState<number[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const allExpanded =
    filteredItems.length > 0 &&
    filteredItems.every((_, idx) => openIndices.includes(idx));

  const toggleItem = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIndices([]);
    } else {
      setOpenIndices(filteredItems.map((_, idx) => idx));
    }
  };

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

      <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            <HelpCircle className="h-3.5 w-3.5" />
            Clear Answers
          </div>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            {title}
          </h2>
          <div className="w-16 h-1.5 bg-primary rounded-full mx-auto" />
        </div>

        {/* Controls: Search & Expand/Collapse All */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass p-3 rounded-2xl border border-border/50">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              id="faq-search-input"
              name="faq-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search FAQ questions"
              className="w-full bg-background/50 pl-10 pr-4 py-2 text-sm rounded-xl border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="w-full sm:w-auto shrink-0 rounded-xl gap-2 font-semibold text-xs border-border/60 hover:bg-secondary"
          >
            <ChevronsUpDown className="h-4 w-4 text-primary" />
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>

        {/* FAQ Items List */}
        <div className="space-y-3" role="list">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground glass rounded-2xl border border-border/40">
              <p className="text-sm font-medium">No matching questions found.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isOpen = openIndices.includes(index);
              return (
                <div
                  key={index}
                  role="listitem"
                  className={`border rounded-2xl overflow-hidden glass transition-all duration-300 ${
                    isOpen
                      ? 'border-primary/40 bg-primary/5 shadow-lg'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left font-semibold text-sm md:text-base hover:text-primary transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
