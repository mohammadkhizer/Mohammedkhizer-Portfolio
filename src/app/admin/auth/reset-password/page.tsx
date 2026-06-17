"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

// ─── Password strength indicator ─────────────────────────────────────────────
interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const PASSWORD_RULES: Rule[] = [
  { label: "At least 12 characters",        test: (v) => v.length >= 12 },
  { label: "One uppercase letter (A-Z)",    test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a-z)",    test: (v) => /[a-z]/.test(v) },
  { label: "One number (0-9)",              test: (v) => /[0-9]/.test(v) },
  { label: "One special character (!@#…)",  test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function PasswordStrength({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const pct = (passed / PASSWORD_RULES.length) * 100;
  const color =
    pct <= 20 ? "bg-red-500" :
    pct <= 40 ? "bg-orange-500" :
    pct <= 60 ? "bg-yellow-500" :
    pct <= 80 ? "bg-blue-500" : "bg-emerald-500";
  const label =
    pct <= 20 ? "Very Weak" :
    pct <= 40 ? "Weak" :
    pct <= 60 ? "Fair" :
    pct <= 80 ? "Strong" : "Very Strong";

  return (
    <div className="space-y-2 mt-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 w-20 text-right">{password ? label : ""}</span>
      </div>

      {/* Rule checklist */}
      {password && (
        <ul className="grid grid-cols-1 gap-1">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(password);
            return (
              <li key={rule.label} className="flex items-center gap-1.5">
                {ok
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  : <XCircle className="h-3.5 w-3.5 text-red-400/70 shrink-0" />}
                <span className={`text-xs ${ok ? "text-slate-300" : "text-slate-500"}`}>
                  {rule.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // sends httpOnly cookies
        body: JSON.stringify({ password: data.password }),
      });

      const result = await res.json();

      if (res.status === 401) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: result.message + " Please restart the password reset.",
        });
        router.push("/admin/auth/forgot-password");
        return;
      }

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: result.message,
        });
        return;
      }

      setIsSuccess(true);
      toast({ title: "Password Updated ✓", description: "All sessions revoked. Redirecting to login…" });
      setTimeout(() => router.push("/admin/login"), 3000);
    } catch {
      toast({ variant: "destructive", title: "Network Error", description: "Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Password Updated!</h1>
          <p className="text-slate-400 text-sm">
            All active sessions have been revoked. A confirmation email has been sent.
            Redirecting to login…
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-xs text-indigo-300 font-medium">Step 3 of 3 — New Password</span>
          </div>
        </div>

        <Card className="border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Create New Password</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Choose a strong password. All existing sessions will be logged out.
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 pr-10"
                    placeholder="Minimum 12 characters"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrength password={passwordValue} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 pr-10"
                    placeholder="Repeat your password"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Security reminder */}
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 space-y-1">
                <p className="text-slate-400 text-xs font-medium">🔒 After update:</p>
                <ul className="text-slate-500 text-xs space-y-0.5 list-inside list-disc">
                  <li>All active sessions will be revoked</li>
                  <li>A confirmation email will be sent</li>
                  <li>You will be redirected to the login page</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                id="reset-password-btn"
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password…
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
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
