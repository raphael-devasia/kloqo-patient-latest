
"use client";

import { useState } from "react";
import AppointmentsList from "@/components/appointments-list";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed">("Upcoming");

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center relative justify-center mt-4">
        <button onClick={() => router.back()} className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">My Appointments</h1>
      </div>

      <div className="flex justify-around mt-6 border-b">
        <button
          onClick={() => setActiveTab("Upcoming")}
          className={cn(
            "pb-2 font-semibold",
            activeTab === "Upcoming"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-muted-foreground"
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("Completed")}
          className={cn(
            "pb-2 font-semibold",
            activeTab === "Completed"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-muted-foreground"
          )}
        >
          Completed
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <AppointmentsList filter={activeTab} />
      </div>

      <div className="py-4 px-4 border-t bg-background">
        <Link href="/doctors" passHref>
          <Button className="w-full h-12 rounded-lg text-lg bg-red-600 hover:bg-red-700">
            Book new Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}
