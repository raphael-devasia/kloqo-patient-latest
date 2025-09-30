

"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doctors, appointments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Star, ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "./date-picker";

const scheduleSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor."),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time slot." }),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const timeSlots = [
    "08:00 AM", "09:30 AM", "10:00 AM", 
    "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM"
];

export default function ScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");

  const { toast } = useToast();

  const doctor = doctors.find(d => d.id === preselectedDoctorId);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      doctorId: preselectedDoctorId || "",
      date: new Date(),
    }
  });

  const { handleSubmit, control, watch, formState: { errors } } = form;
  const selectedDate = watch('date');

  const bookedSlots = appointments
    .filter(
      (appointment) =>
        appointment.doctorId === doctor?.id &&
        appointment.date === format(selectedDate, "yyyy-MM-dd")
    )
    .map((appointment) => appointment.time);

  const availableSlotsCount = timeSlots.length - bookedSlots.length;


  useEffect(() => {
    if (preselectedDoctorId) {
      form.setValue("doctorId", preselectedDoctorId);
    }
  }, [preselectedDoctorId, form]);


  const onSubmit = (data: ScheduleFormValues) => {
    console.log(data);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor?.name} on ${format(data.date, 'PPP')} at ${data.time} is confirmed.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground'
    });
    router.push('/appointments');
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Doctor not found. Please select a doctor first.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full">
      <div className="relative h-96">
        <Image
          src={doctor.avatar}
          alt={doctor.name}
          layout="fill"
          objectFit="cover"
          className="rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl"></div>
        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
            <Button variant="ghost" size="icon" className="bg-white/80 rounded-full h-10 w-10" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
        </div>
        <div className="absolute bottom-6 left-6 text-white w-[calc(100%-3rem)]">
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p className="text-lg">{doctor.clinic}</p>
          <p className="text-base text-white/90">{doctor.specialty}</p>
        </div>
        
        <Card className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm border-none text-white p-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4"/>
                <span className="font-medium">Mon - Fri</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="rounded-t-3xl -mt-6 shadow-none border-0 bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">About Doctor</h3>
              <p className="text-sm text-foreground/80">{doctor.bio}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Select Date</h3>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ChevronLeft className="w-4 h-4 cursor-pointer" />
                  <span>{format(form.getValues('date'), 'MMMM yyyy')}</span>
                  <ChevronRight className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                    <DatePicker date={field.value} onDateChange={field.onChange} />
                )}
              />
              {errors.date && <p className="text-sm text-destructive mt-2">{errors.date.message}</p>}
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Select Time</h3>
                    <p className="text-sm text-muted-foreground">{availableSlotsCount} slots Available</p>
                </div>
               <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-3"
                  >
                    {timeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <div key={slot}>
                            <RadioGroupItem 
                              value={slot} 
                              id={slot} 
                              className="peer sr-only" 
                              disabled={isBooked}
                            />
                            <Label
                              htmlFor={slot}
                              className={cn(
                                "flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 text-sm font-medium",
                                isBooked 
                                  ? "cursor-not-allowed bg-muted/50 text-muted-foreground line-through"
                                  : "hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary"
                              )}
                            >
                              {slot}
                            </Label>
                          </div>
                        )
                    })}
                  </RadioGroup>
                )}
              />
              {errors.time && <p className="text-sm text-destructive mt-2">{errors.time.message}</p>}
            </div>
            <div className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg">
                    Book an Appointment
                </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
