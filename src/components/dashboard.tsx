import { user, appointments } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TokenTracker from "./token-tracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const nextAppointment = appointments.find(
    (appt) => appt.status === "Upcoming" && new Date(appt.date) >= new Date()
  );

  return (
    <div className="grid gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your day.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TokenTracker />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>
              Your upcoming scheduled consultation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="flex items-start space-x-4 rounded-lg border bg-secondary/50 p-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage
                    src={nextAppointment.doctorAvatar}
                    alt={nextAppointment.doctorName}
                  />
                  <AvatarFallback>
                    {nextAppointment.doctorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-semibold">{nextAppointment.doctorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {nextAppointment.type}
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(nextAppointment.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{nextAppointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">No upcoming appointments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
