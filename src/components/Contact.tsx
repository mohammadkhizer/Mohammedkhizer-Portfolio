"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Send, Github, Linkedin, Instagram, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Get in <span className="text-primary">Touch</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Looking for a collaborator or just want to discuss technology? Reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Email</h4>
                  <p className="text-muted-foreground">work.mkhizer@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Phone</h4>
                  <p className="text-muted-foreground">+91 9510865651</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Location</h4>
                  <p className="text-muted-foreground">Ahmedabad, Gujarat, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <h4 className="text-lg font-bold mb-6">Social Links</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild>
                  <a href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild>
                  <a href="https://github.com/mohammadkhizer" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild>
                  <a href="https://www.instagram.com/khizerrrr11/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="glass border-border/40 p-8">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Name</label>
                      <Input placeholder="Mohammed Khizer" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Email</label>
                      <Input type="email" placeholder="khizer@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Message</label>
                    <Textarea placeholder="How can I help you today?" className="min-h-[150px]" required />
                  </div>
                  <Button disabled={loading} className="w-full py-6 text-lg font-bold gap-2">
                    {loading ? "Sending..." : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
