"use client";

import Link from "next/link";
import { LayoutDashboard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Admin Panel", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col justify-between md:flex shrink-0">
      <div className="flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide text-primary">CAKRAPAY</h1>
              <p className="text-xs text-muted-foreground font-medium">e-Wallet Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-md"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
