
"use client";

import {
  AlarmClock,
  BriefcaseMedical,
  CalendarDays,
  HelpCircle,
  LogOut,
  Mail,
  BookOpen,
  FilePenLine,
} from "lucide-react";
import Link from "next/link";
import { user } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const menuItems = [
  { href: "#", label: "Track disease", icon: AlarmClock },
  { href: "/doctors", label: "Go doctors", icon: BriefcaseMedical },
  { href: "/appointments", label: "Appointment", icon: CalendarDays },
  { href: "#", label: "Learning", icon: BookOpen },
  { href: "#", label: "Quiz", icon: FilePenLine },
  { href: "#", label: "Messages", icon: Mail },
  { href: "#", label: "FAQ", icon: HelpCircle },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  return (
    <>
        <div
            className={cn(
            "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsOpen(false)}
        />
        <aside
            className={cn(
            "fixed top-0 left-0 h-full w-3/4 max-w-sm bg-transparent z-50 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-[calc(100%-2rem)] m-4 bg-background text-foreground rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <Link href="/profile" legacyBehavior>
                      <a className="text-sm text-muted-foreground hover:underline" onClick={() => setIsOpen(false)}>
                          View profile
                      </a>
                  </Link>
                  </div>
              </div>
              <Separator className="mb-6"/>

              <nav className="flex-1 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => (
                  <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-3 rounded-lg text-base font-medium text-gray-700 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                  >
                      <item.icon className="w-6 h-6 text-muted-foreground" />
                      <span>{item.label}</span>
                  </Link>
                  ))}
              </nav>

              <div className="mt-6">
                  <Button variant="ghost" className="w-full justify-start p-3 text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-6 h-6 mr-4" />
                  <span>Log out</span>
                  </Button>
              </div>
            </div>
        </aside>
    </>
  );
}
