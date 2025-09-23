import AppointmentsList from "@/components/appointments-list";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your Appointments</h1>
        <p className="text-muted-foreground">
          Manage your upcoming and view your past bookings.
        </p>
      </div>
      <AppointmentsList />
    </div>
  );
}
