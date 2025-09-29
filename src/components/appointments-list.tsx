
"use client";

import { appointments, doctors } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";
import { cn } from "@/lib/utils";

const AppointmentCard = ({ appointment, index }: { appointment: Appointment, index: number }) => {
  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const cardColors = ['bg-[#F2FFE3]', 'bg-[#E7D7C9]'];
  const cardColor = cardColors[index % cardColors.length];

  return (
    <Card className={cn("shadow-md", cardColor)}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
              <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-base">{doctor?.name}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                 <Stethoscope className="h-4 w-4" />
                <span>{doctor?.specialty}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-4">
            <SmartRescheduleDialog appointment={appointment} />
            <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white">Cancel</Button>
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
  let appointmentCounter = 0;

  return (
    <div className="space-y-6 relative">
       <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-gray-200"></div>
       {dates.map((dateStr, dateIndex) => (
         <div key={dateStr}>
            <div className="flex items-start gap-4 relative">
                <div className="w-16 flex-shrink-0 flex flex-col items-center z-10 pt-1">
                    <div className="h-10 w-10 rounded-full bg-[#fec868] flex items-center justify-center ring-4 ring-background">
                        <span className="font-bold text-xl text-gray-800">{format(parseISO(dateStr), 'dd')}</span>
                    </div>
                </div>
                <div className="flex-1 space-y-4 pt-1">
                    {/* Placeholder to align cards correctly when there's no single-appointment row */}
                </div>
            </div>
            {appointmentsByDate[dateStr].map(appt => (
                <div key={appt.id} className="flex items-start gap-4 relative mt-2">
                    <div className="w-16 flex-shrink-0 flex flex-col items-center z-10">
                         <span className="text-sm font-bold text-muted-foreground mt-0 mb-0">{format(parseISO(dateStr), 'MMM')}</span>
                        <div className="text-xs text-muted-foreground font-semibold">
                            {appt.time}
                        </div>
                    </div>
                    <div className="flex-1">
                        <AppointmentCard appointment={appt} index={appointmentCounter++} />
                    </div>
                </div>
            ))}
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
