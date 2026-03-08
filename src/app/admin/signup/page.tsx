"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignupPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account Created",
        description: "Your account has been created. Please ensure you are authorized as an admin in the database.",
      });
      router.push("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-6">
      <Card className="w-full max-w-md glass border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Signup</CardTitle>
          <CardDescription>Create an account to access the dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Restriction</AlertTitle>
              <AlertDescription>
                After signing up, your UID must be manually added to the <code className="font-bold">admins</code> collection in Firestore to gain write access.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/admin/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
