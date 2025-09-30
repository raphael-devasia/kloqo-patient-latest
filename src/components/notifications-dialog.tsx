
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/data";
import { Bell, Calendar, Clock, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Calendar className="h-5 w-5 text-primary" />;
    case "delay":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "availability":
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function NotificationsDialog() {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            You have {unreadCount} unread messages.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-lg border",
                notification.isRead ? "bg-card" : "bg-accent/50"
              )}
            >
              <div className="p-2 bg-background rounded-full">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
           {notifications.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              You have no notifications.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline">Clear All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
