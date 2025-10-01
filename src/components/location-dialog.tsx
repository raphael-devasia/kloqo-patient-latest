
"use client";

import { useState, useEffect } from "react";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Fetch city suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (city.length > 1) {
        fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=5`)
          .then(res => res.json())
          .then(data => {
            const seen = new Set();
            setSuggestions(
              data
                .map((item: any) => item.display_name)
                .filter((name: string) => {
                  if (seen.has(name)) return false;
                  seen.add(name);
                  return true;
                })
            );
          });
      } else {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [city]);

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
              onChange={e => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
              autoComplete="off"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-30 bg-white border border-gray-200 mt-1 w-full rounded shadow max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onMouseDown={() => {
                      setCity(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Update Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
