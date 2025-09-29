"use client";

import { appointments, doctors } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Stethoscope, Star, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";
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
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex justify-start gap-2 mt-3 ml-16">
            <SmartRescheduleDialog appointment={appointment} />
            <Button variant="link" className="text-red-500 px-0">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AppointmentsList() {
    const upcomingAppointments = appointments
    .filter(appt => appt.status === "Upcoming")
    .sort((a, b) => {
        const timeA = parse(a.time, 'hh:mm a', new Date());
        const timeB = parse(b.time, 'hh:mm a', new Date());
        return timeA.getTime() - timeB.getTime();
    });
    
  const appointmentsByHour: { [hour: string]: Appointment[] } = {};
  upcomingAppointments.forEach(appt => {
    const hour = format(parse(appt.time, 'hh:mm a', new Date()), 'ha');
    if (!appointmentsByHour[hour]) {
        appointmentsByHour[hour] = [];
    }
    appointmentsByHour[hour].push(appt);
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 7).map(h => {
    const hour12 = h > 12 ? h - 12 : h;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hourStr = `${hour12} ${ampm}`;
    const hourKey = format(parse(hourStr, 'h a', new Date()), 'ha');
    return { display: hourStr, key: hourKey };
  });

  return (
    <div className="space-y-4 relative">
       <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
       {hours.map(({ display, key }) => (
         <div key={display} className="flex items-start gap-4">
           <div className="w-16 flex-shrink-0 flex justify-center z-10">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{display}</span>
           </div>
           <div className="flex-1 space-y-4 pt-1">
             {appointmentsByHour[key] ? (
               appointmentsByHour[key].map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
             ) : (
                <div className="h-8"></div>
             )}
           </div>
         </div>
       ))}
    </div>
  );
}