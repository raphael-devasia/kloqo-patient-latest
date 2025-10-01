
"use client";

import { appointments as initialAppointments, doctors, user } from "@/lib/data";
import { Appointment } from "@/lib/types";
import { format, parse, parseISO, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import AppointmentCard from "./appointment-card";

const pastelColors = ['rgba(214, 151, 89, 0.5)', 'rgba(160, 125, 138, 0.5)', 'rgba(141, 184, 165, 0.5)', 'rgba(245, 183, 177, 0.5)', 'rgba(174, 214, 241, 0.5)', 'rgba(249, 231, 159, 0.5)'];


export default function AppointmentsList({ filter }: { filter: "Upcoming" | "Completed" }) {
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
        .filter(appt => {
            const appointmentDate = parseISO(appt.date);
            const status = isPast(appointmentDate) ? "Completed" : "Upcoming";
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
       {filteredAppointments.map((appt, index) => (
         <AppointmentCard 
          key={appt.id} 
          appointment={appt} 
          onCancelSuccess={handleCancelSuccess} 
          cardStyle={ filter === 'Upcoming' ? { backgroundColor: pastelColors[index % pastelColors.length] } : {}}
         />
       ))}
    </div>
  );
}
