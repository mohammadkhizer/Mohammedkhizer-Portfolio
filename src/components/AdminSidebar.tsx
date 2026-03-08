"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Code2, 
  Briefcase, 
  FolderKanban, 
  Award, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Quote,
  UserCircle,
  Settings,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Inquiries", href: "/admin/contact", icon: Mail },
  { name: "Profile Settings", href: "/admin/profile", icon: Settings },
  { name: "Technical Skills", href: "/admin/skills", icon: Code2 },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <aside className={cn(
      "h-screen glass border-r flex flex-col transition-all duration-300 z-50",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-black tracking-tighter">
            Admin<span className="text-primary">.</span>
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto hover:bg-secondary rounded-full h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">Logged in as</p>
              <p className="text-[11px] font-bold truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-3 rounded-xl transition-all duration-200",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-border/50",
            isCollapsed ? "px-2" : "px-3 py-6"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="font-bold">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
