"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Loader2, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, UI_LABELS } from "@/lib/constants";

interface ProvisionError {
  hasError: boolean;
  message: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, userError } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isProvisioning, setIsProvisioning] = React.useState(false);
  const [provisionError, setProvisionError] = React.useState<ProvisionError | null>(null);

  const isAuthPage =
    pathname === "/admin/login";

  React.useEffect(() => {
    if (!isUserLoading && !user && !isAuthPage) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, isAuthPage, router]);

  const handleProvisionAdmin = async () => {
    setIsProvisioning(true);
    setProvisionError(null);
    try {
      const res = await fetch('/api/admin/auth/provision', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Provision failed');
      }
      window.location.reload();
    } catch {
      setProvisionError({
        hasError: true,
        message: ERROR_MESSAGES.AUTH_PROVISION_FAILED,
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  // Auth state error handling
  if (userError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-2" />
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground max-w-md">
          {ERROR_MESSAGES.AUTH_STATE_ERROR}
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Return to Portfolio
        </Button>
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Check if they are authorized admin from the session
  const isAuthorizedAdmin = !!(user && user.isAdmin);

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <Lock className="h-12 w-12 text-destructive mb-2" />
        <h1 className="text-2xl font-bold">{UI_LABELS.ADMIN_ACCESS_DENIED}</h1>
        <p className="text-muted-foreground max-w-md">
          {UI_LABELS.ADMIN_NO_PRIVILEGES}
        </p>
        {provisionError && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {provisionError.message}
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            {UI_LABELS.ADMIN_RETURN_PORTFOLIO}
          </Button>
          {user?.email === 'work.mkhizer@gmail.com' && (
             <Button onClick={handleProvisionAdmin} disabled={isProvisioning}>
               {isProvisioning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
               {UI_LABELS.ADMIN_PROVISION_BUTTON}
             </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-secondary/10 h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
