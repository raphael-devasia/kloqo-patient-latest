
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CancelAppointmentDialog({ appointmentId, onCancelSuccess }: { appointmentId: string, onCancelSuccess: (id: string) => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCancelConfirm = () => {
    // In a real app, you'd call an API to cancel.
    // For this demo, we'll just update the local state.
    onCancelSuccess(appointmentId);
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">Cancel</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your
            appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelConfirm} className="bg-destructive hover:bg-destructive/90">
            Yes, Cancel Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
