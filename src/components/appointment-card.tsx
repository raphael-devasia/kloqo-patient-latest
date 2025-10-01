
"use client";

import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";
import CancelAppointmentDialog from "./cancel-appointment-dialog";
import { savedPatients, user } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import React from "react";

type AppointmentCardProps = {
  appointment: Appointment;
  onCancelSuccess: (id: string) => void;
  cardStyle?: React.CSSProperties;
  variant?: 'dashboard' | 'default';
};

const AppointmentCard = ({ appointment, onCancelSuccess, cardStyle, variant = 'default' }: AppointmentCardProps) => {
  const appointmentDate = parseISO(appointment.date);
  const token = `A${String(appointment.id.replace('appt', '')).padStart(3, '0')}`;
  const isDashboard = variant === 'dashboard';

  const patient = 
    (appointment.patientDetails?.name === user.name)
      ? user 
      : (savedPatients.find(p => p.name === appointment.patientDetails?.name) || user);
      
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  const textColorStyle = cardStyle?.backgroundColor ? { color: 'hsl(var(--card-foreground))' } : {};
  const mutedColorStyle = cardStyle?.backgroundColor ? { color: 'hsl(var(--muted-foreground))' } : {};
  
  if (cardStyle?.backgroundColor) {
    textColorStyle.color = '#000'; // Or a more suitable dark color
    mutedColorStyle.color = 'rgba(0, 0, 0, 0.7)';
  }


  return (
    <Card className="shadow-md" style={cardStyle}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("flex flex-col items-center", isDashboard ? "w-12" : "w-16")}>
          <span className={cn("text-muted-foreground", isDashboard ? "text-xs" : "text-sm")} style={mutedColorStyle}>{format(appointmentDate, 'MMM')}</span>
          <span className={cn("font-bold text-primary", isDashboard ? "text-2xl" : "text-3xl")} style={textColorStyle}>{format(appointmentDate, 'dd')}</span>
          <span className={cn("text-muted-foreground", isDashboard ? "text-xs" : "text-sm")} style={mutedColorStyle}>{format(appointmentDate, 'E')}</span>
        </div>
        <div className="border-l pl-4 flex-1 space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground" style={mutedColorStyle}>Time</p>
              <p className={cn("font-semibold", isDashboard ? "text-sm" : "")} style={textColorStyle}>{appointment.time}</p>
            </div>
            {isDashboard ? (
                <div className="flex items-center">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                    </Avatar>
                </div>
            ) : (
                <div>
                    <p className={cn("font-semibold text-right", isDashboard ? "text-sm" : "")} style={textColorStyle}>{appointment.patientDetails?.name || user.name}</p>
                </div>
            )}
          </div>
           <div>
              <p className={cn("font-bold", isDashboard ? "text-base" : "")} style={textColorStyle}>{appointment.doctorName}</p>
              <p className={cn("text-sm text-muted-foreground", isDashboard ? "text-xs" : "text-sm")} style={mutedColorStyle}>{appointment.specialty}</p>
              {!isDashboard && (
                <p className="text-sm text-muted-foreground" style={mutedColorStyle}>Token: <span className="font-semibold text-primary" style={textColorStyle}>{token}</span></p>
              )}
            </div>
          {!isDashboard && (
            <div className="flex justify-end pt-2 gap-2">
              <CancelAppointmentDialog appointmentId={appointment.id} onCancelSuccess={onCancelSuccess} />
              <SmartRescheduleDialog appointment={appointment} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
