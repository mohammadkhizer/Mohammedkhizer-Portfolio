
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { recommendProjects, type RecommendProjectsOutput } from "@/ai/flows/recommend-projects-flow";
import { UI_LABELS } from "@/lib/constants";
import { sanitizeAiInput } from "@/lib/security-client";

interface AIAssistantError {
  hasError: boolean;
  message: string;
}

export function AIAssistant() {
  const [interest, setInterest] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<RecommendProjectsOutput | null>(null);
  const [error, setError] = React.useState<AIAssistantError | null>(null);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await recommendProjects({ interest: sanitizeAiInput(interest) });
      setResults(data);
    } catch (err) {
      setError({
        hasError: true,
        message: "Failed to fetch recommendations. Please try again.",
      });
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-accent/5 rounded-3xl border border-accent/20 px-8">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            {UI_LABELS.AI_ASSISTANT_TITLE}
          </div>
          <h3 className="text-3xl font-bold">Find the right project for <span className="text-accent">your needs</span></h3>
          <p className="text-muted-foreground">
            {UI_LABELS.AI_ASSISTANT_DESCRIPTION}
          </p>

          <form onSubmit={handleRecommend} className="flex gap-3">
            <Input
              placeholder={UI_LABELS.AI_ASSISTANT_PLACEHOLDER}
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="bg-background/50 border-accent/20 focus-visible:ring-accent"
              disabled={loading}
            />
            <Button disabled={loading} className="bg-accent hover:bg-accent/90 text-white shrink-0">
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : UI_LABELS.AI_ASSISTANT_BUTTON}
            </Button>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error.message}
            </div>
          )}
        </div>

        <div className="flex-1 w-full">
          {error ? (
            <div className="h-64 border-2 border-dashed border-destructive/30 rounded-2xl flex items-center justify-center text-destructive/70 italic text-center px-6">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Unable to load recommendations</p>
            </div>
          ) : results ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              {results.recommendations.map((rec, i) => (
                <Card key={i} className="glass border-accent/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {rec.name}
                      <a href={`#${rec.projectId}`} className="text-accent hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-accent/80 font-medium">{UI_LABELS.AI_ASSISTANT_MATCHING_REASON}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rec.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-accent/20 rounded-2xl flex items-center justify-center text-muted-foreground/50 italic text-center px-6">
              {UI_LABELS.AI_ASSISTANT_EMPTY}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
