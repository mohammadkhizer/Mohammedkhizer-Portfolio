
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
  Mail,
  Menu,
  X
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
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  // Close mobile sidebar on navigation
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button - Floating and Fixed */}
      <div className="fixed top-4 left-4 z-[60] md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="shadow-xl bg-background border-primary/30 rounded-full h-10 w-10 flex items-center justify-center"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] md:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        // Core Layout
        "fixed inset-y-0 left-0 z-[55] flex flex-col transition-all duration-300 ease-in-out md:relative",
        // Visuals - Forced solid background
        "bg-background border-r border-border shadow-2xl md:shadow-none",
        // Desktop Width Logic
        isCollapsed ? "md:w-20" : "md:w-64",
        // Mobile Position Logic
        isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between shrink-0">
          <Link href="/admin" className={cn(
            "text-xl font-black tracking-tighter flex items-center gap-1 transition-all duration-300",
            isCollapsed && "md:opacity-0 md:scale-50"
          )}>
            Admin<span className="text-primary">.</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex hover:bg-secondary rounded-full h-8 w-8 text-muted-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Navigation - Scrollable Area */}
        <nav className="flex-1 px-3 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "truncate transition-all duration-300",
                  isCollapsed && "md:opacity-0 md:-translate-x-4 md:pointer-events-none"
                )}>
                  {item.name}
                </span>
                {/* Tooltip hint for collapsed state */}
                {isCollapsed && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block whitespace-nowrap z-50">
                     {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - User & Logout */}
        <div className="p-4 border-t border-border mt-auto space-y-4 shrink-0 bg-background/50">
          <div className={cn(
            "flex items-center gap-3 px-1 transition-all duration-300",
            isCollapsed && "md:opacity-0 md:scale-50"
          )}>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground truncate">Operator</p>
              <p className="text-[11px] font-bold truncate text-foreground">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start gap-3 rounded-xl transition-all duration-200 h-11",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border-border",
              isCollapsed && "md:px-0 md:justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn(
              "font-bold transition-all duration-300",
              isCollapsed && "md:hidden"
            )}>
              Logout System
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
}
