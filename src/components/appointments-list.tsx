
"use client";

import { appointments, doctors } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Stethoscope, Star, ChevronRight } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const doctor = doctors.find((d) => d.id === appointment.doctorId);

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
              <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-base">{doctor?.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <Stethoscope className="h-4 w-4" />
                <span>{doctor?.specialty}</span>
                <span className="text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {doctor?.rating.toFixed(1)}
                </span>
              </div>
               <p className="text-sm mt-1">{appointment.type}</p>
                 <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mt-2 inline-block">
                    {appointment.time}
                </div>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex justify-end items-center mt-3">
          <div className="flex gap-2">
            <SmartRescheduleDialog appointment={appointment} />
            <Button variant="link" className="text-red-500 px-0">Cancel</Button>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AppointmentsList() {
    const upcomingAppointments = appointments
    .filter(appt => appt.status === "Upcoming")
    .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }
        const timeA = parse(a.time, 'hh:mm a', new Date());
        const timeB = parse(b.time, 'hh:mm a', new Date());
        return timeA.getTime() - timeB.getTime();
    });
    
  const appointmentsByDate: { [date: string]: Appointment[] } = {};
  upcomingAppointments.forEach(appt => {
    const dateKey = format(parseISO(appt.date), 'yyyy-MM-dd');
    if (!appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(appt);
  });

  const dates = Object.keys(appointmentsByDate).sort();

  return (
    <div className="space-y-6 relative">
       <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
       {dates.map((dateStr) => (
         <div key={dateStr} className="flex items-start gap-4 relative">
           <div className="w-16 flex-shrink-0 flex flex-col items-center z-10 pt-1">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                    <span className="font-bold text-2xl text-primary-foreground">{format(parseISO(dateStr), 'dd')}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground mt-1">{format(parseISO(dateStr), 'MMM')}</span>
           </div>
           <div className="flex-1 space-y-4 pt-1">
             {appointmentsByDate[dateStr].map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
           </div>
         </div>
       ))}
       {dates.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
              You have no upcoming appointments.
          </div>
       )}
    </div>
  );
}
