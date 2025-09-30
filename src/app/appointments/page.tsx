import AppointmentsList from "@/components/appointments-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AppointmentsPage() {
  return (
    <div className="relative h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Schedule</h1>
        </div>
        <AppointmentsList />
      </div>
    </div>
  );
}
