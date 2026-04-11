
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Send, Github, Linkedin, Instagram, Phone, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { validateCsrfToken, generateCsrfToken } from "@/lib/security-client";
import { sanitizeInput } from "@/lib/utils";

export function Contact() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [loading, setLoading] = React.useState(false);
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null);

  // Generate CSRF token on mount
  React.useEffect(() => {
    setCsrfToken(generateCsrfToken());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Capture the form element immediately before any async await calls
    // to prevent 'e.currentTarget' from becoming null after the await.
    const formElement = e.currentTarget;
    
    setLoading(true);

    try {
      const response = await fetch("/api/rate-limit", { method: "POST" });
      const result = await response.json();

      if (!response.ok || result.limited) {
        toast({
          variant: "destructive",
          title: "Too Many Requests",
          description: result.message || "Please wait a moment before sending another message.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData(formElement);

      // 2. Sanitize inputs on the client
      const name = sanitizeInput(formData.get("name") as string);
      const email = sanitizeInput(formData.get("email") as string);
      const subject = sanitizeInput(formData.get("subject") as string);
      const message = sanitizeInput(formData.get("message") as string);

      // 3. Validate required fields
      if (!name || !email || !message) {
        toast({
          variant: "destructive",
          title: "Missing Fields",
          description: "Please fill out all required fields."
        });
        setLoading(false);
        return;
      }

      // 4. Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address."
        });
        setLoading(false);
        return;
      }

      // 5. Validate input lengths
      if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
        toast({
          variant: "destructive",
          title: "Input Too Long",
          description: "Please keep your message within reasonable limits."
        });
        setLoading(false);
        return;
      }

      // 6. Validate CSRF token
      if (!csrfToken || !validateCsrfToken(csrfToken)) {
        toast({
          variant: "destructive",
          title: "Security Error",
          description: "Please refresh the page and try again."
        });
        setLoading(false);
        return;
      }

      if (!firestore) {
        toast({
          variant: "destructive",
          title: "Service Unavailable",
          description: "Firebase is not yet initialized. Please refresh and try again.",
        });
        setLoading(false);
        return;
      }

      const submissionsRef = collection(firestore, "contactSubmissions");
      
      // 3. Perform the Firestore write (Non-Blocking Pattern)
      addDocumentNonBlocking(submissionsRef, {
        id: crypto.randomUUID(),
        senderName: name,
        senderEmail: email,
        subject: subject || "No Subject",
        message: message,
        submissionDate: new Date().toISOString(),
        isRead: false,
        apiVersion: 1
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset the form
      formElement.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure Submission
          </div>
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
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild aria-label="LinkedIn Profile">
                  <a href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild aria-label="GitHub Profile">
                  <a href="https://github.com/mohammadkhizer" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild aria-label="Instagram Profile">
                  <a href="https://www.instagram.com/khizerrrr11/" target="_blank" rel="noopener noreferrer">
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
                  {/* CSRF Token Hidden Field */}
                  <input type="hidden" name="csrfToken" value={csrfToken || ""} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold" htmlFor="name">Name</label>
                      <Input id="name" name="name" placeholder="Mohammed Khizer" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold" htmlFor="email">Email</label>
                      <Input id="email" name="email" type="email" placeholder="khizer@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="subject">Subject (Optional)</label>
                    <Input id="subject" name="subject" placeholder="Project Inquiry" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" htmlFor="message">Message</label>
                    <Textarea id="message" name="message" placeholder="How can I help you today?" className="min-h-[150px]" required />
                  </div>
                  <Button disabled={loading} className="w-full py-6 text-lg font-bold gap-2">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground italic">
                    All inputs are sanitized and protected by IP-based rate limiting.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
