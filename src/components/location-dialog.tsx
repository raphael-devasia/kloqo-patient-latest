
"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LocationDialogProps = {
  children: React.ReactNode;
  onLocationUpdate: (city: string) => void;
};

export default function LocationDialog({ children, onLocationUpdate }: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      toast({
        title: "City name required",
        description: "Please enter a city name to update your location.",
        variant: "destructive",
      });
      return;
    }
    onLocationUpdate(city);
    setOpen(false);
    setCity("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Change Location
          </DialogTitle>
          <DialogDescription>
            Enter a new city to see doctors and clinics near you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="city">City Name</Label>
            <Input
              id="city"
              placeholder="e.g., San Francisco"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
