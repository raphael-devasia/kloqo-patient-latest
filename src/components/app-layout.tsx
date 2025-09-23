"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HeartPulse,
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { user } from "@/lib/data";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/schedule", label: "Schedule", icon: PlusCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible='none' side='bottom' variant='inset'>
        <SidebarContent className="p-0 m-0">
          <SidebarMenu className="flex-row justify-around h-16 items-center bg-card border-t">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href} className="flex-1">
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    variant='ghost'
                    className="flex-col h-auto w-full p-1"
                  >
                    <item.icon className="w-5 h-5"/>
                    <span className="text-xs">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-md font-semibold">MediQueue</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-20">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
