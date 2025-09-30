
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

const AppointmentOptions = ({ appointment }: { appointment: Appointment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Appointment</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <XCircle className="mr-2 h-4 w-4" />
          <span>Cancel Appointment</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CalendarPlus className="mr-2 h-4 w-4" />
          <span>Add to Calendar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
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
          <div className="flex justify-end pt-2">
             <AppointmentOptions appointment={appointment} />
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

    const filteredAppointments = appointments
        .filter(appt => {
            const status = isPast(parseISO(appt.date)) ? "Completed" : "Upcoming";
            return status === filter && appt.status !== 'Cancelled';
        })
        .sort((a, b) => {
            const dateA = parseISO(a.date);
            const dateB = parseISO(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return filter === "Upcoming" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
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
         <AppointmentCard key={appt.id} appointment={appt} />
       ))}
    </div>
  );
}
