"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const { user, refreshSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const authError = searchParams.get("error");

  React.useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/admin" });
    } catch {
      toast({
        variant: "destructive",
        title: "Sign in error",
        description: "Failed to initiate Google sign-in.",
      });
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rateLimitResponse = await fetch("/api/rate-limit", { method: "POST" });
      const rateLimitResult = await rateLimitResponse.json();

      if (!rateLimitResponse.ok || rateLimitResult.limited) {
        toast({
          variant: "destructive",
          title: "Too Many Attempts",
          description: rateLimitResult.message || "Please wait a moment before trying again.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      toast({
        title: "Welcome Back",
        description: "Successfully signed in to the admin panel.",
      });

      await refreshSession();
      router.push("/admin");
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass border-primary/20 bg-card/80 backdrop-blur-md shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
          <Lock className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Admin Console</CardTitle>
        <CardDescription>Restricted single-owner portal. Authenticate with authorized credentials.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {authError && (
          <div className="flex items-start gap-3 p-3 text-sm rounded-lg bg-destructive/15 border border-destructive/30 text-destructive">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Access Denied</p>
              <p className="text-xs opacity-90">
                {authError === "AccessDenied"
                  ? "Your account is not authorized. Access is strictly restricted to the registered owner."
                  : "Authentication failed. Please verify credentials."}
              </p>
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full border-border/80 hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center gap-2 h-11"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Sign in with Google (Single Owner)</span>
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full absolute" />
          <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground relative">
            Or credentials
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="work.mkhizer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <CardFooter className="px-0 pt-2 pb-0">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" disabled={loading || googleLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in with Password"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
