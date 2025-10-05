
"use client";

import { appointments as initialAppointments, doctors, user } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { format, parse, parseISO, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import AppointmentCard from "./appointment-card";

const upcomingColor = '#CAD7E4';


export default function AppointmentsList({ filter }: { filter: "Upcoming" | "History" }) {
    const [appointments, setAppointments] = useState(initialAppointments);

    useEffect(() => {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
            const parsedAppointments = JSON.parse(storedAppointments);
            setAppointments(parsedAppointments);
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
        .map(appt => {
             const appointmentDate = parseISO(appt.date);
             const status = appt.status === 'Cancelled' ? 'Cancelled' : (isPast(appointmentDate) ? "Past" : "Upcoming");
             return { ...appt, status };
        })
        .filter(appt => {
            if (filter === 'History') {
                return appt.status === 'Past' || appt.status === 'Cancelled';
            }
            return appt.status === filter;
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
       {filteredAppointments.map((appt, index) => {
        const isHistory = appt.status === 'Past' || appt.status === 'Cancelled';
        return (
         <AppointmentCard 
          key={appt.id} 
          appointment={appt} 
          onCancelSuccess={handleCancelSuccess} 
          cardStyle={isHistory ? { backgroundColor: 'white' } : { backgroundColor: upcomingColor }}
         />
        )
       })}
    </div>
  );
}
