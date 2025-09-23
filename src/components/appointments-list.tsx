"use client";

import { appointments, doctors } from "@/lib/data";
import { Appointment } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Stethoscope } from "lucide-react";
import { format, isPast } from "date-fns";
import SmartRescheduleDialog from "./smart-reschedule-dialog";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const isPastAppointment = isPast(new Date(appointment.date)) && appointment.status !== 'Upcoming';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar className="h-14 w-14 border">
          <AvatarImage src={doctor?.avatar} alt={doctor?.name} />
          <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-lg">{doctor?.name}</p>
          <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          <span>Type: {appointment.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.time}</span>
        </div>
      </CardContent>
      {!isPastAppointment && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <SmartRescheduleDialog appointment={appointment} />
        </CardFooter>
      )}
    </Card>
  );
};

export default function AppointmentsList() {
  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === "Upcoming" && !isPast(new Date(appt.date))
  );
  const pastAppointments = appointments.filter(
    (appt) => appt.status === "Past" || (appt.status === "Upcoming" && isPast(new Date(appt.date)))
  );

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))
          ) : (
            <p className="col-span-full mt-4 text-center text-muted-foreground">
              No upcoming appointments.
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="past">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))
          ) : (
            <p className="col-span-full mt-4 text-center text-muted-foreground">
              No past appointments.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
