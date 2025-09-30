
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
import { Separator } from "./ui/separator";

type LocationDialogProps = {
  children: React.ReactNode;
  onLocationUpdate: (city: string) => void;
  onUseCurrentLocation: () => void;
};

export default function LocationDialog({ children, onLocationUpdate, onUseCurrentLocation }: LocationDialogProps) {
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

  const handleUseCurrentLocation = () => {
    onUseCurrentLocation();
    setOpen(false);
    toast({
        title: "Location Updated",
        description: "We're finding doctors near you.",
    });
  }

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
            Enter a new city or use your current location to find doctors near you.
          </DialogDescription>
        </DialogHeader>
        
        <Button variant="outline" onClick={handleUseCurrentLocation}>Use my current location</Button>
        
        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

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
