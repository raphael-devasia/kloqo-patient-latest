import ScheduleForm from "@/components/schedule-form";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Schedule New Appointment</h1>
        <p className="text-muted-foreground">
          Book a new consultation with one of our specialists.
        </p>
      </div>
      <ScheduleForm />
    </div>
  );
}
