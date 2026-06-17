"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOTPSchema, type VerifyOTPInput } from "@/lib/validations/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, RotateCcw, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

// OTP digit count
const OTP_LENGTH = 6;

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [otpDigits, setOtpDigits] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOTPInput>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: { email: emailFromQuery, otp: "" },
  });

  // Sync OTP digits array → form field
  React.useEffect(() => {
    setValue("otp", otpDigits.join(""));
  }, [otpDigits, setValue]);

  // Resend countdown
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── OTP Input handlers ────────────────────────────────────────────────────
  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); // only last digit
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtpDigits(pasted.split(""));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: VerifyOTPInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 429) {
        toast({ variant: "destructive", title: "Rate Limited", description: result.message });
        return;
      }

      if (!res.ok) {
        toast({ variant: "destructive", title: "Verification Failed", description: result.message });
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      toast({ title: "OTP Verified ✓", description: "Proceeding to password reset…" });
      router.push("/admin/auth/reset-password");
    } catch {
      toast({ variant: "destructive", title: "Network Error", description: "Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0 || !emailFromQuery) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailFromQuery }),
      });

      if (res.status === 429) {
        toast({ variant: "destructive", title: "Rate Limited", description: "Too many resend requests." });
        return;
      }

      toast({ title: "OTP Resent", description: "A new OTP has been sent to your email." });
      setResendCooldown(60);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      toast({ variant: "destructive", title: "Network Error", description: "Could not resend OTP." });
    } finally {
      setIsResending(false);
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
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-xs text-indigo-300 font-medium">Step 2 of 3 — Verify OTP</span>
          </div>
        </div>

        <Card className="border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <KeyRound className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Enter OTP</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                We sent a 6-digit code to{" "}
                <span className="text-indigo-400 font-medium">{emailFromQuery || "your email"}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Hidden email field */}
            <input type="hidden" {...register("email")} />

            <CardContent className="space-y-6">
              {/* OTP digit inputs */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm font-medium sr-only">6-Digit OTP</Label>
                <div
                  className="flex gap-2 justify-center"
                  onPaste={handleDigitPaste}
                  role="group"
                  aria-label="One-time password input"
                >
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpDigits[i]}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                      id={`otp-digit-${i}`}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-slate-600/60 bg-slate-800/60 text-white caret-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all duration-150 select-none"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-400 text-xs text-center mt-1" role="alert">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              {/* Expiry notice */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 text-sm">⚡</span>
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  OTP expires in <strong>5 minutes</strong>. Do not share this code with anyone.
                  If you didn&apos;t request this, contact your system administrator immediately.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                id="verify-otp-btn"
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200"
                disabled={isSubmitting || otpDigits.join("").length < OTP_LENGTH}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                id="resend-otp-btn"
                className="w-full text-slate-400 hover:text-slate-200 text-sm h-9"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0 || !emailFromQuery}
              >
                {isResending ? (
                  <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Resending…</>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <><RotateCcw className="mr-2 h-3.5 w-3.5" />Resend OTP</>
                )}
              </Button>

              <Link
                href="/admin/auth/forgot-password"
                className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Forgot Password
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
