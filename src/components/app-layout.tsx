
"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LiveIcon from './ui/live-icon';

const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/live", label: "Live", icon: LiveIcon },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === '/';
  const themedPages = ['/doctors', '/schedule', '/live', '/appointments', '/categories', '/clinics'];
  const isThemedPage = themedPages.some(page => pathname.startsWith(page));
  const isSchedulePage = pathname === '/schedule';


  return (
    <div className={cn("flex flex-col h-full bg-background", isThemedPage && "themed-page", isDashboard && "dashboard-page")}>
      <main className={cn("flex-1 overflow-auto", isDashboard ? "" : "p-4 sm:p-6", isSchedulePage ? "!p-0" : "", "pb-24")}>{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t border-border/60 z-20 w-[414px] mx-auto rounded-b-[44px]">
        <nav className="flex justify-around items-center h-full px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground -translate-y-2 shadow-lg" : "text-muted-foreground"
                )}
              >
                  <item.icon className="w-6 h-6" />
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
