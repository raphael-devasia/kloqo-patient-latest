
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doctors } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Stethoscope, User, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

const scheduleSchema = z.object({
  specialty: z.string().min(1, "Please select a specialty."),
  doctorId: z.string().min(1, "Please select a doctor."),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time slot." }),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export default function ScheduleForm() {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");
  const preselectedSpecialty = searchParams.get("specialty");

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(preselectedSpecialty || "");
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
        specialty: preselectedSpecialty || "",
        doctorId: preselectedDoctorId || "",
    }
  });

  const { handleSubmit, control, watch, reset, formState: { errors } } = form;
  const watchedDoctorId = watch("doctorId");

  useEffect(() => {
    if (preselectedSpecialty) {
      setSelectedSpecialty(preselectedSpecialty);
      form.setValue("specialty", preselectedSpecialty);
    }
    if (preselectedDoctorId) {
      form.setValue("doctorId", preselectedDoctorId);
    }
  }, [preselectedDoctorId, preselectedSpecialty, form]);


  const onSubmit = (data: ScheduleFormValues) => {
    console.log(data);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctors.find(d => d.id === data.doctorId)?.name} on ${format(data.date, 'PPP')} at ${data.time} is confirmed.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground'
    });
    reset({
        specialty: "",
        doctorId: "",
        date: undefined,
        time: "",
    });
    setSelectedSpecialty("");
  };

  const specialties = [...new Set(doctors.map((doc) => doc.specialty))];
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => doc.specialty === selectedSpecialty)
    : [];

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>Fill out the form below to book your appointment.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Specialty Selection */}
            <div className="space-y-2">
              <Label className={cn(errors.specialty && 'text-destructive')}>
                <Stethoscope className="inline-block mr-2 h-4 w-4" />
                Specialty
              </Label>
              <Controller
                name="specialty"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSpecialty(value);
                      form.setValue("doctorId", "");
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.specialty && <p className="text-sm text-destructive">{errors.specialty.message}</p>}
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label className={cn(errors.doctorId && 'text-destructive')}>
                <User className="inline-block mr-2 h-4 w-4" />
                Doctor
              </Label>
              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
               <Label className={cn(errors.date && 'text-destructive')}>
                <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <div className="rounded-md border flex justify-center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </div>
                )}
              />
               {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
               <Label className={cn(errors.time && 'text-destructive')}>
                <Clock className="inline-block mr-2 h-4 w-4" />
                Available Slots
              </Label>
               <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-2 pt-2"
                    disabled={!watchedDoctorId}
                  >
                    {timeSlots.map((slot) => (
                      <div key={slot}>
                        <RadioGroupItem value={slot} id={slot} className="peer sr-only" />
                        <Label
                          htmlFor={slot}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto ml-auto">Confirm Appointment</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
