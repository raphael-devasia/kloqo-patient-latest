
"use client";

import { appointments as initialAppointments, doctors, user } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, MoreVertical, Edit, XCircle, CalendarPlus } from "lucide-react";
import { format, parse, parseISO, isPast } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CancelAppointmentDialog from "./cancel-appointment-dialog";

const AppointmentCard = ({ appointment, onCancelSuccess }: { appointment: Appointment, onCancelSuccess: (id: string) => void }) => {
  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const appointmentDate = parseISO(appointment.date);
  const token = String(appointment.id.replace('appt', '')).padStart(3, '0');

  return (
    <Card className="shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex flex-col items-center w-16">
          <span className="text-sm text-muted-foreground">{format(appointmentDate, 'MMM')}</span>
          <span className="text-3xl font-bold text-red-600">{format(appointmentDate, 'dd')}</span>
          <span className="text-sm text-muted-foreground">{format(appointmentDate, 'E')}</span>
        </div>
        <div className="border-l pl-4 flex-1 space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Timing</p>
              <p className="font-semibold">{appointment.time}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">For</p>
              <p className="font-semibold">{appointment.patientDetails?.name || user.name}</p>
            </div>
          </div>
           <div>
              <p className="font-bold">{appointment.doctorName}</p>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              <p className="text-sm text-muted-foreground">Token: <span className="font-semibold text-primary">{token}</span></p>
            </div>
          <div className="flex justify-end pt-2 gap-2">
             <CancelAppointmentDialog appointmentId={appointment.id} onCancelSuccess={onCancelSuccess} />
             <SmartRescheduleDialog appointment={appointment} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AppointmentsList({ filter }: { filter: "Upcoming" | "Completed" }) {
    const [appointments, setAppointments] = useState(initialAppointments);

    useEffect(() => {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        } else {
            setAppointments(initialAppointments);
        }
    }, []);

    const handleCancelSuccess = (cancelledAppointmentId: string) => {
      const updatedAppointments = appointments.map(appt => 
        appt.id === cancelledAppointmentId ? { ...appt, status: 'Cancelled' } : appt
      );
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    };

    const filteredAppointments = appointments
        .filter(appt => {
            const status = isPast(parseISO(appt.date)) ? "Completed" : "Upcoming";
            return status === filter && appt.status !== 'Cancelled';
        })
        .sort((a, b) => {
            const dateA = parseISO(a.date);
            const dateB = parseISO(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return filter === "Upcoming" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - a.getTime();
            }
            const timeA = parse(a.time, 'hh:mm a', new Date());
            const timeB = parse(b.time, 'hh:mm a', new Date());
            return timeA.getTime() - timeB.getTime();
        });

  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        You have no {filter.toLowerCase()} appointments.
      </div>
    );
  }

  return (
    <div className="space-y-4">
       {filteredAppointments.map(appt => (
         <AppointmentCard key={appt.id} appointment={appt} onCancelSuccess={handleCancelSuccess} />
       ))}
    </div>
  );
}
