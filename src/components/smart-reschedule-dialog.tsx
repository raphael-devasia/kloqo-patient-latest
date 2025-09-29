"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSmartRescheduleSuggestions } from "@/app/actions";
import { Appointment } from "@/lib/types";
import { Loader2, Wand2, CalendarCheck, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { doctors } from "@/lib/data";

type SuggestionResult = {
  suggestedTimes: string[];
  reasoning: string;
};

export default function SmartRescheduleDialog({ appointment }: { appointment: Appointment }) {
  const [preferences, setPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const doctor = doctors.find((d) => d.id === appointment.doctorId);


  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state on close
      setPreferences("");
      setResult(null);
      setIsLoading(false);
    }
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.trim()) {
      toast({
        title: "Preferences needed",
        description: "Please enter your preferences for rescheduling.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    const actionResult = await getSmartRescheduleSuggestions(preferences);

    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
    } else {
      toast({
        title: "Error",
        description: actionResult.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">Reschedule</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Smart Reschedule
          </DialogTitle>
          <DialogDescription>
            Tell us your preferences, and our AI will suggest the best new times for your appointment with {doctor?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="preferences">Your Preferences</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., 'I prefer mornings next week', 'Any time after 3 PM on weekdays', 'Available on Monday or Wednesday'"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Times...
              </>
            ) : (
              "Get Suggestions"
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">AI-Powered Suggestions</h3>
            <div className="grid gap-3">
              {result.suggestedTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-5 w-5 text-accent-foreground" />
                    <span className="font-medium">{time}</span>
                  </div>
                  <Button size="sm" variant="outline">Select</Button>
                </div>
              ))}
            </div>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>AI Reasoning</AlertTitle>
              <AlertDescription>{result.reasoning}</AlertDescription>
            </Alert>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
