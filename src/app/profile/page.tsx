
"use client"

import { user } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Moon, User as UserIcon, KeyRound, Bell, Languages, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

const SettingsItem = ({
  icon,
  iconBgColor,
  label,
  children,
  href
}: {
  icon: React.ReactNode;
  iconBgColor?: string;
  label: string;
  children?: React.ReactNode;
  href?: string;
}) => {
  const content = (
    <div className="flex items-center justify-between w-full py-3">
      <div className="flex items-center gap-4">
        {iconBgColor ? (
          <div className="p-2 rounded-full" style={{ backgroundColor: iconBgColor }}>
            {icon}
          </div>
        ) : (
          icon
        )}
        <span className="font-medium text-primary">{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default function SettingsPage() {
  return (
    <div className="bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-2">
        <Link href="/profile/edit">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{user.name}</p>
              </div>
            </div>
            
          </div>
        </Link>
        
        <div className="py-2">
          <SettingsItem
            icon={<Moon className="w-6 h-6 text-white" />}
            iconBgColor="#739c7b"
            label="Dark Mode"
          >
            <Switch defaultChecked />
          </SettingsItem>
        </div>

        <div>
          <SettingsItem
            icon={<UserIcon className="w-5 h-5 text-white" />}
            iconBgColor="#739c7b"
            label="Edit Profile"
            href="/profile/edit"
          >
            
          </SettingsItem>
          <SettingsItem
            icon={<KeyRound className="w-5 h-5 text-white" />}
            iconBgColor="#739c7b"
            label="Change Password"
          >
            
          </SettingsItem>
        </div>

        <div className="py-2">
          <SettingsItem
            icon={<Bell className="w-5 h-5 text-white" />}
            iconBgColor="#739c7b"
            label="Notifications"
          >
            <Switch defaultChecked />
          </SettingsItem>
        </div>
        
        <div>
          <SettingsItem
            icon={<Languages className="w-5 h-5 text-white" />}
            iconBgColor="#739c7b"
            label="Language"
          >
            
          </SettingsItem>
          <SettingsItem
            icon={<LogOut className="w-5 h-5 text-white" />}
            iconBgColor="#739c7b"
            label="Logout"
          >
            
          </SettingsItem>
        </div>
      </div>
      
      <div className="text-center text-muted-foreground mt-8 text-sm">
        App ver 2.0.1
      </div>
    </div>
  );
}
