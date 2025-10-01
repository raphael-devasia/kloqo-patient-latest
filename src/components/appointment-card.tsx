
"use client";

import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";
import CancelAppointmentDialog from "./cancel-appointment-dialog";
import { user } from "@/lib/data";
import { cn } from "@/lib/utils";

type AppointmentCardProps = {
  appointment: Appointment;
  onCancelSuccess: (id: string) => void;
  cardClassName?: string;
  variant?: 'dashboard' | 'default';
};

const AppointmentCard = ({ appointment, onCancelSuccess, cardClassName, variant = 'default' }: AppointmentCardProps) => {
  const appointmentDate = parseISO(appointment.date);
  const token = `A${String(appointment.id.replace('appt', '')).padStart(3, '0')}`;
  const isDashboard = variant === 'dashboard';

  return (
    <Card className={cn("shadow-md", cardClassName)}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("flex flex-col items-center w-16", isDashboard ? "w-12" : "w-16")}>
          <span className={cn("text-muted-foreground", isDashboard ? "text-xs" : "text-sm")}>{format(appointmentDate, 'MMM')}</span>
          <span className={cn("font-bold text-primary", isDashboard ? "text-2xl" : "text-3xl")}>{format(appointmentDate, 'dd')}</span>
          <span className={cn("text-muted-foreground", isDashboard ? "text-xs" : "text-sm")}>{format(appointmentDate, 'E')}</span>
        </div>
        <div className="border-l pl-4 flex-1 space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className={cn("font-semibold", isDashboard ? "text-sm" : "")}>{appointment.time}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">For</p>
              <p className={cn("font-semibold", isDashboard ? "text-sm" : "")}>{appointment.patientDetails?.name || user.name}</p>
            </div>
          </div>
           <div>
              <p className={cn("font-bold", isDashboard ? "text-base" : "")}>{appointment.doctorName}</p>
              <p className={cn("text-sm text-muted-foreground", isDashboard ? "text-xs" : "text-sm")}>{appointment.specialty}</p>
              {!isDashboard && (
                <p className="text-sm text-muted-foreground">Token: <span className="font-semibold text-primary">{token}</span></p>
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
