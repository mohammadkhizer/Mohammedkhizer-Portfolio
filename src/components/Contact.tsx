"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  Instagram,
  Phone,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { refreshCsrfToken, submitContactForm } from "@/actions/contact";
import { getStoredUtmParams } from "@/lib/utmTracker";
import { ConfirmationModal } from "@/components/ConfirmationModal";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  
  // State management for success & error states
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  // Confirmation modal state
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Form input refs/state for reset confirmation
  const [formDataState, setFormDataState] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle cooldown timer
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Generate/Fetch CSRF token from server on mount
  React.useEffect(() => {
    refreshCsrfToken().then((token) => setCsrfToken(token));
  }, []);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    if (!formDataState.name.trim()) errors.name = "Name is required.";
    if (!formDataState.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDataState.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formDataState.message.trim()) {
      errors.message = "Message cannot be empty.";
    } else if (formDataState.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    if (cooldown > 0) {
      toast({
        variant: "destructive",
        title: "Rate Limited",
        description: `Please wait ${cooldown} seconds before sending another message.`,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.set("name", formDataState.name);
    formData.set("email", formDataState.email);
    formData.set("subject", formDataState.subject);
    formData.set("message", formDataState.message);

    if (csrfToken) formData.set("csrfToken", csrfToken);

    // Attach UTM Parameters if available
    const utmParams = getStoredUtmParams();
    if (utmParams) {
      formData.set("utm_source", utmParams.utm_source || "");
      formData.set("utm_medium", utmParams.utm_medium || "");
      formData.set("utm_campaign", utmParams.utm_campaign || "");
    }

    try {
      const result = await submitContactForm(formData);

      if (!result.success) {
        const errorMsg = result.error || "Something went wrong. Please try again.";
        setServerError(errorMsg);
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: errorMsg,
        });

        if (errorMsg.includes("Too many requests") || errorMsg.includes("rate limit")) {
          setCooldown(60);
        }
        setLoading(false);
        return;
      }

      // Success State Triggered
      setIsSuccess(true);
      setCooldown(60); // Enforce 60-second cooldown on success
      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out. I'll get back to you shortly.",
      });

      refreshCsrfToken().then((token) => setCsrfToken(token));
    } catch {
      const errorMsg = "An unexpected network error occurred. Please try again later.";
      setServerError(errorMsg);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormDataState({ name: "", email: "", subject: "", message: "" });
    setFieldErrors({});
    setServerError(null);
    setIsSuccess(false);
    setShowResetConfirm(false);
  };

  return (
    <section id="contact" className="py-24 relative">
      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Contact Form?"
        description="Are you sure you want to clear all entered information? This action cannot be undone."
        confirmLabel="Reset Form"
        onConfirm={handleResetForm}
        onCancel={() => setShowResetConfirm(false)}
      />

      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure Submission
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Looking for a collaborator, full-stack developer, or just want to discuss software engineering? Reach out using the secure form below or via direct contact info.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information Column */}
          <div className="lg:col-span-5 space-y-8">
            <address className="space-y-6 not-italic">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Email</h4>
                  <a
                    href="mailto:work.mkhizer@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    work.mkhizer@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Phone</h4>
                  <a
                    href="tel:+919510865651"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +91 9510865651
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Location</h4>
                  <p className="text-muted-foreground">Ahmedabad, Gujarat, India</p>
                </div>
              </div>
            </address>

            <div className="pt-8 border-t border-border/50">
              <h4 className="text-lg font-bold mb-6">Social Links</h4>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-white transition-colors"
                  asChild
                  aria-label="LinkedIn Profile"
                >
                  <a
                    href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-white transition-colors"
                  asChild
                  aria-label="GitHub Profile"
                >
                  <a
                    href="https://github.com/mohammadkhizer"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-white transition-colors"
                  asChild
                  aria-label="Instagram Profile"
                >
                  <a
                    href="https://www.instagram.com/khizerrrr11/"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form / Success State Column */}
          <div className="lg:col-span-7">
            <Card className="glass border-border/40 p-8 shadow-2xl relative overflow-hidden">
              <CardContent className="p-0">
                {isSuccess ? (
                  /* Form Success State Card */
                  <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Message Delivered!</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                        Thank you <strong className="text-foreground">{formDataState.name}</strong>. Your message has been transmitted securely. I will respond to <span className="text-primary font-medium">{formDataState.email}</span> within 24-48 hours.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-2xl text-xs text-muted-foreground border border-border/40 flex items-center justify-center gap-2 max-w-sm mx-auto">
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <span>Confirmation copy logged & rate limit protection active</span>
                    </div>

                    <Button
                      onClick={handleResetForm}
                      variant="outline"
                      className="rounded-xl gap-2 font-semibold"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  /* Standard Form State */
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <input type="hidden" name="csrfToken" value={csrfToken || ""} />

                    {/* Form Error Banner */}
                    {serverError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-start gap-3 text-destructive text-sm animate-in fade-in">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <strong className="font-bold">Submission Failed</strong>
                          <p>{serverError}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex justify-between" htmlFor="name">
                          <span>Name <span className="text-destructive">*</span></span>
                          {fieldErrors.name && (
                            <span className="text-xs text-destructive">{fieldErrors.name}</span>
                          )}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formDataState.name}
                          onChange={(e) => {
                            setFormDataState({ ...formDataState, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                          }}
                          placeholder="Mohammed Khizer"
                          className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex justify-between" htmlFor="email">
                          <span>Email <span className="text-destructive">*</span></span>
                          {fieldErrors.email && (
                            <span className="text-xs text-destructive">{fieldErrors.email}</span>
                          )}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formDataState.email}
                          onChange={(e) => {
                            setFormDataState({ ...formDataState, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                          }}
                          placeholder="khizer@example.com"
                          className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold" htmlFor="subject">
                        Subject (Optional)
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formDataState.subject}
                        onChange={(e) => setFormDataState({ ...formDataState, subject: e.target.value })}
                        placeholder="Project Inquiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex justify-between" htmlFor="message">
                        <span>Message <span className="text-destructive">*</span></span>
                        {fieldErrors.message && (
                          <span className="text-xs text-destructive">{fieldErrors.message}</span>
                        )}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formDataState.message}
                        onChange={(e) => {
                          setFormDataState({ ...formDataState, message: e.target.value });
                          if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: undefined });
                        }}
                        placeholder="How can I help you today?"
                        className={`min-h-[150px] ${
                          fieldErrors.message ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="submit"
                        disabled={loading || cooldown > 0}
                        className="flex-1 py-6 text-base font-bold gap-2 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : cooldown > 0 ? (
                          `Please wait ${cooldown}s`
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>

                      {(formDataState.name || formDataState.email || formDataState.message) && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowResetConfirm(true)}
                          className="py-6 px-4 rounded-xl text-muted-foreground hover:text-foreground"
                          title="Reset Form"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                      All inputs are sanitized and protected by IP-based rate limiting.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
