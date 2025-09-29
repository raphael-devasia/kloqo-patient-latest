import AppointmentsList from "@/components/appointments-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AppointmentsPage() {
  return (
    <div className="relative h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Schedule</h1>
          <p className="text-muted-foreground">
            A timeline of your upcoming appointments.
          </p>
        </div>
        <AppointmentsList />
      </div>
       <Link href="/schedule">
        <button className="fixed bottom-24 right-6 bg-primary text-primary-foreground h-14 w-14 rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-8 h-8" />
        </button>
      </Link>
    </div>
  );
}
