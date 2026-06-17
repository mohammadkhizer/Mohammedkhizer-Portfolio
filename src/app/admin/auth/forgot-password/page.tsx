"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Countdown timer for cooldown UX
  React.useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(() => setCooldownSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 429) {
        toast({
          variant: "destructive",
          title: "Rate Limited",
          description: result.message,
        });
        setCooldownSeconds(60);
        return;
      }

      // Always show generic message regardless of backend outcome
      toast({
        title: "OTP Sent",
        description: "If an admin account exists, you will receive an OTP email shortly.",
      });

      // Navigate to verify step, passing email via query param (non-sensitive — email is not a secret here)
      router.push(
        `/admin/auth/verify-otp?email=${encodeURIComponent(data.email)}`
      );
    } catch {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not reach the server. Check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-xs text-indigo-300 font-medium">Secure Admin Recovery</span>
          </div>
        </div>

        <Card className="border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Enter your admin email to receive a one-time password
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Admin Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourdomain.com"
                  autoComplete="email"
                  className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-400 text-xs flex items-center gap-1 mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Security notice */}
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
                <p className="text-slate-400 text-xs leading-relaxed">
                  🔒 For security, we&apos;ll only respond if this email is associated with a verified admin account. OTP expires in <strong className="text-slate-300">5 minutes</strong>.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                id="send-otp-btn"
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200"
                disabled={isSubmitting || cooldownSeconds > 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP…
                  </>
                ) : cooldownSeconds > 0 ? (
                  `Resend in ${cooldownSeconds}s`
                ) : (
                  "Send OTP"
                )}
              </Button>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Admin Login
              </Link>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-6">
          Unauthorized access attempts are logged and prosecuted.
        </p>
      </div>
    </div>
  );
}
