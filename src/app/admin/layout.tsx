"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const MASTER_UID = 'eg1KGzcz7fNQSwZL79FMkQUSjVh2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isProvisioning, setIsProvisioning] = React.useState(false);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";

  const adminDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "admins", user.uid);
  }, [firestore, user]);

  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminDocRef);

  React.useEffect(() => {
    if (!isUserLoading && !user && !isAuthPage) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, isAuthPage, router]);

  const handleProvisionAdmin = async () => {
    if (!user || !firestore) return;
    setIsProvisioning(true);
    try {
      await setDoc(doc(firestore, "admins", user.uid), {
        isAdmin: true,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to provision admin record:", error);
    } finally {
      setIsProvisioning(false);
    }
  };

  if (isUserLoading || (user && isAdminLoading && !isAuthPage)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Check for the isAdmin: true field OR the master UID bypass
  const isAuthorizedAdmin = user && (user.uid === MASTER_UID || (adminData && adminData.isAdmin === true));

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <Lock className="h-12 w-12 text-destructive mb-2" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          You are signed in but do not have administrative privileges. 
          Please ensure your UID <code className="bg-muted px-1 rounded">{user?.uid}</code> is in the 
          <code className="font-bold"> admins</code> collection with <code className="font-bold text-primary">isAdmin: true</code>.
        </p>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Return to Portfolio
          </Button>
          {user?.uid === MASTER_UID && (
             <Button onClick={handleProvisionAdmin} disabled={isProvisioning}>
               {isProvisioning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
               Provision Admin Record
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
