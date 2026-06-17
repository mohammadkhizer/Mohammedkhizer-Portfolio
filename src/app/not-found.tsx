import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-black text-primary/20">404</div>
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <Search className="h-4 w-4 mr-2" />
              View Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
