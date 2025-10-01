
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
};

const AppointmentCard = ({ appointment, onCancelSuccess, cardClassName }: AppointmentCardProps) => {
  const appointmentDate = parseISO(appointment.date);
  const token = `A${String(appointment.id.replace('appt', '')).padStart(3, '0')}`;

  return (
    <Card className={cn("shadow-md", cardClassName)}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex flex-col items-center w-16">
          <span className="text-sm text-muted-foreground">{format(appointmentDate, 'MMM')}</span>
          <span className="text-3xl font-bold text-primary">{format(appointmentDate, 'dd')}</span>
          <span className="text-sm text-muted-foreground">{format(appointmentDate, 'E')}</span>
        </div>
        <div className="border-l pl-4 flex-1 space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
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

export default AppointmentCard;
